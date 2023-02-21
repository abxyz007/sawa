import Vue from "vue";
import {configure, extend, ValidationObserver, ValidationProvider} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import i18n from "@/plugins/118n/i18n";

configure({
	defaultMessage:(field , values) => {
		return i18n.t(`validation.${values._rule_}`, values)
	}
})

extend('url', {
	validate(value) {
		if (value) {
			return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value);
		}
		return false;
	},
	message: 'This value must be a valid URL',
});

Object.keys(rules).forEach(rule => {
	extend(rule, {
		...rules[rule],
	});
});



Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

