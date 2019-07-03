export const state = () => ({
  org: {
    id: "",
    name: ""
  }
});

export const mutations = {
  setOrg(state, payload) {
    state.org = payload;
  }
};
