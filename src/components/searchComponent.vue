<template>
  <div class="">
      <div class="Typeahead">
          <el-input
            class="nav-search-input"
            :placeholder="placeholder"
            autocomplete="off"
            v-model="query"
            @keydown.down="down"
            @keydown.up="up"
            @keydown.enter="hit"
            @keydown.esc="reset"
            @blur="reset"
            @input="update"
            >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <ul v-show="hasItems" class="search-menu">
            <li v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)" :key="item.index" class="search-menu-list">
                    <span>
                        <div v-if="userType === 'cop'" class="tt-suggestion"> {{ item.cop_name }}  </div>
                        <div v-if="userType === 'cop'" class="tt-suggestion"> {{ item.cop_phone }}  </div>
                        <div v-if="userType === 'peer'" class="tt-suggestion"> {{ item.user_name }}  </div>
                        <div v-if="userType === 'peer'" class="tt-suggestion"> {{ item.user_phone }}  </div>
                    </span>
            </li>
    </ul>
  </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */

import Axios from 'axios';
import VueTypeahead from 'vue-typeahead';
import Vue from 'vue';

Vue.prototype.$http = Axios;

export default {
    name: 'SearchComponent',
    extends: VueTypeahead,
    props: ['placeholder'],
    data() {
        return {
            limit: 10,
            minChars: 1,
            query: '',
            userType: null,
        };
    },
    computed: {
        query_string() {
            localStorage.setItem('query', this.query);
            return this.query.trim();
        },
        solarBase() {
            return `${VUE_APP_SOLR_BASE}`;
        },
        solarToken() {
            return `${VUE_APP_SOLR_JWT}`;
        },
        current_route() {
         return this.$route.name;
        },
         src() {
             let searchString = '';
             const copUser = `${this.solarBase}${VUE_APP_SOLR_COP_USERS}select?q=cop_name:*${this.query_string}*+OR+contact_person:*${this.query_string}*+OR+cop_phone:*${this.query_string}*+OR+account_no:*${this.query_string}*&wt=json&indent=true&row=10&sort=cop_id%20desc&jwt=${this.solarToken}`;

            const peerUser = `${this.solarBase}${VUE_APP_SOLR_PEER_USERS}select?q=(user_phone:*${this.query_string}*+OR+user_name:*${this.query_string}*+OR+user_email:*${this.query_string}*+OR+user_status:*${this.query_string}*)&wt=json&indent=true&row=10&sort=user_id%20desc&jwt=${this.solarToken}`;

            const owner = `${this.solarBase}${VUE_APP_SOLR_OWNERS}select?q=(name:*${this.query_string}*+OR+id_no:*${this.query_string}*+OR+phone:*${this.query_string}*)&wt=json&indent=true&row=10&sort=id%20desc&jwt=${this.solarToken}`;

             switch (this.current_route) {
                 case 'freight-business':
                     searchString = copUser;
                     this.userType = 'cop';
                     break;
                case 'freight-peer':
                     searchString = peerUser;
                     this.userType = 'peer';

                     break;
                case 'transporter':
                     searchString = owner;
                     this.userType = 'transporter';

                     break;
                 case 'peer-inconsistencies':
                     searchString = peerUser;
                     this.userType = 'peer';

                     break;
                 case 'reviewed-business':
                     searchString = copUser;
                     this.userType = 'cop';

                     break;
                 case 'cop-inconsistencies':
                     searchString = copUser;
                     this.userType = 'cop';

                     break;
                 case 'reviewed-peer':
                     searchString = peerUser;
                     this.userType = 'peer';

                     break;
                 default:
                     break;
             }


             return searchString;
         },
    },
    methods: {
        onHit(item) {
            const user = this.userType;
            let param = null;
            let id = null;

            switch (this.userType) {
                case 'cop':
                     param = 'copId';
                     id = item.cop_id;
                    break;
                 case 'peer':
                     param = 'userId';
                     id = item.user_id;
                    break;
                 case 'transporter':
                     param = 'transporter';
                     id = item.owner_id;
                    break;

                default:
                    break;
            }
            const searchArray = {
             userType: this.userType, param, id, searched: true,
            };
            this.$store.commit('searchedApplicant', searchArray);
        },
        prepareResponseData(data) {
            const response = data.response.docs;
            const freightData = response.filter((res) => res.freight_status === 1 || res.freight_status === '1');
        return response;
    },
    },
};
</script>

<style scoped>

.search-menu {
    padding: 10px 3px;
    margin-top: 2px;
    background-color: #fff;
    list-style: none;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0,0,0,.25);
    z-index: 1000;
    position: absolute;
    width: 22%;
}
.search-menu-list {
    align-items: center;
    display: flex;
    flex: 1 1 100%;
    letter-spacing: normal;
    min-height: 48px;
    outline: none;
    padding: 0 16px;
    position: relative;
    text-decoration: none;
    cursor: pointer;
    min-height: 64px;
    border-bottom: 1px solid #f7f7f7;
}
li:hover {
  background: #EDF1F7;
    border-radius: 6px;
    margin: 7px;
}
</style>
