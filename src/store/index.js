import Vue from 'vue'
import Vuex from 'vuex'
import fileUploader from "./fileUploader";
import configuration from "./configuration";
import { http } from '@/utils/http'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loading: false,
        errorMessage: '',
        snackbar: {},
        user: null,
    },
    mutations: {
        SET_SNACKBAR(state, snackbar) {
            state.snackbar = snackbar;
        },
        setUser(state, user) {
            state.user = user;
        }
    },
    actions: {
        setSnackbar({commit}, snackbar) {
            snackbar.showing = true;
            snackbar.color = snackbar.color || 'success';
            snackbar.time = snackbar.time || 2000;
            snackbar.btn = snackbar.btn || 'OK';
            snackbar.text = snackbar.text || 'Что-то пошло не так!';
            commit('SET_SNACKBAR', snackbar);
        },
        setUser({commit}) {
            http.post('auth/me')
                .then(response => {
                    if (response.data.success) {
                        commit('setUser', response.data.data);
                    }else {
                        commit('setSnackbar', {
                            color: 'red',
                            text: 'Something went wrong!'
                        })
                    }
                });
        }
    },
    modules: {
        fileUploader,
        configuration
    }

})
