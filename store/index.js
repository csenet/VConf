export const state = () => ({
  counter: Number
});

export const mutations = {
  increment (state) {
    state.counter++;
  }
};
