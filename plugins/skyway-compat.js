/**
 * SkyWay Compatibility Layer
 * 
 * This module provides a compatibility layer between the old skyway-js API
 * and the new @skyway-sdk/room API.
 */

import { 
  SkyWayContext, 
  SkyWayRoom
} from '@skyway-sdk/room';

// Export SkyWay SDK classes for global use
export { SkyWayContext, SkyWayRoom };

// Compatibility class to mimic the old Peer class
export class Peer {
  constructor(options) {
    this.options = options;
    this.id = null;
    this.context = null;
    this._init();
  }

  async _init() {
    try {
      this.context = await SkyWayContext.Create({
        apiKey: this.options.key
      });
      this.id = this.context.authToken.id;
    } catch (error) {
      console.error('SkyWay initialization error:', error);
    }
  }

  // Compatibility method for joinRoom
  async joinRoom(roomName, options) {
    try {
      // Create or join a room
      const room = await SkyWayRoom.FindOrCreate(this.context, {
        type: options.mode || 'sfu',
        name: roomName
      });
      
      // Join the room
      const me = await room.join();
      
      // Create a compatibility wrapper
      const roomWrapper = new RoomWrapper(room, me, options.stream);
      
      // Publish the local stream if provided
      if (options.stream) {
        const publication = await me.publish(options.stream);
        roomWrapper._publications.push(publication);
      }
      
      return roomWrapper;
    } catch (error) {
      console.error('Join room error:', error);
      throw error;
    }
  }
}

// Compatibility class to mimic the old Room class
export class RoomWrapper {
  constructor(room, me, localStream) {
    this.room = room;
    this.me = me;
    this.localStream = localStream;
    this._publications = [];
    this._subscriptions = [];
    this._eventListeners = {
      'open': [],
      'peerJoin': [],
      'peerLeave': [],
      'stream': [],
      'data': [],
      'close': []
    };
    
    this._setupEventListeners();
    
    // Trigger open event on next tick
    setTimeout(() => {
      this._triggerEvent('open');
    }, 0);
  }
  
  _setupEventListeners() {
    // Member joined
    this.room.onMemberJoined.add((member) => {
      this._triggerEvent('peerJoin', member.id);
    });
    
    // Member left
    this.room.onMemberLeft.add((member) => {
      this._triggerEvent('peerLeave', member.id);
    });
    
    // New publication (stream)
    this.room.onStreamPublished.add(async (publication) => {
      if (publication.publisher.id === this.me.id) return;
      
      try {
        const subscription = await this.me.subscribe(publication.id);
        this._subscriptions.push(subscription);
        
        // Add peerId property to mimic old API
        subscription.stream.peerId = publication.publisher.id;
        
        this._triggerEvent('stream', subscription.stream);
      } catch (error) {
        console.error('Subscription error:', error);
      }
    });
    
    // Data channel
    this.room.onDataPublished.add(async (publication) => {
      if (publication.publisher.id === this.me.id) return;
      
      try {
        const subscription = await this.me.subscribe(publication.id);
        subscription.onData.add((data) => {
          this._triggerEvent('data', {
            data,
            src: publication.publisher.id
          });
        });
      } catch (error) {
        console.error('Data subscription error:', error);
      }
    });
  }
  
  _triggerEvent(eventName, ...args) {
    if (this._eventListeners[eventName]) {
      this._eventListeners[eventName].forEach(listener => {
        listener(...args);
      });
    }
  }
  
  // Event handling compatibility
  on(eventName, callback) {
    if (this._eventListeners[eventName]) {
      this._eventListeners[eventName].push(callback);
    }
    return this;
  }
  
  once(eventName, callback) {
    const wrappedCallback = (...args) => {
      callback(...args);
      this.off(eventName, wrappedCallback);
    };
    
    if (this._eventListeners[eventName]) {
      this._eventListeners[eventName].push(wrappedCallback);
    }
    return this;
  }
  
  off(eventName, callback) {
    if (this._eventListeners[eventName]) {
      const index = this._eventListeners[eventName].indexOf(callback);
      if (index !== -1) {
        this._eventListeners[eventName].splice(index, 1);
      }
    }
    return this;
  }
  
  // Stream replacement
  async replaceStream(newStream) {
    try {
      // Unpublish existing streams
      for (const publication of this._publications) {
        await this.me.unpublish(publication.id);
      }
      
      // Publish new stream
      const newPublication = await this.me.publish(newStream);
      this._publications = [newPublication];
      this.localStream = newStream;
    } catch (error) {
      console.error('Replace stream error:', error);
    }
  }
  
  // Send data
  send(data) {
    if (this.room && this.me) {
      this.room.members.forEach(member => {
        if (member.id !== this.me.id) {
          this.me.sendData(member.id, data);
        }
      });
    }
  }
  
  // Close room
  async close() {
    try {
      // Clean up subscriptions
      for (const subscription of this._subscriptions) {
        await this.me.unsubscribe(subscription.id);
      }
      
      // Clean up publications
      for (const publication of this._publications) {
        await this.me.unpublish(publication.id);
      }
      
      // Leave room
      if (this.room && this.me) {
        await this.me.leave();
      }
      
      this._triggerEvent('close');
    } catch (error) {
      console.error('Close room error:', error);
    }
  }
}

export default Peer;
