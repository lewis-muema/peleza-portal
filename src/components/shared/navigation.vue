<template>
    <el-row class="tac">
        <el-col>
            <el-menu
                :default-active="currentRoute"
                :router="true"
                class="el-menu-vertical-demo"
                :default-openeds="['pending']"
                >
                <template v-for="(link, index) in links">
                    <el-menu-item
                        class="nav-text "
                        v-if="!link.hasChild && applicantCategory === link.category"
                        :index="`${link.name}`"
                        :key="index"
                        :route="{ name: link.name }"
                        >
                            <div class="outline-icon">
                                <i class="material-icons-outlined">{{ link.icon }}</i>
                            </div>

                            <span class="applicant-type">{{ link.text }}</span>
                            <span
                            class="applicant-count"
                            v-show="currentRoute === link.name"
                            >{{ applicantCount }}
                            </span>
                    </el-menu-item>
                    <el-submenu
                        class="submenu-text"
                        v-if="link.hasChild"
                        :index="`${link.name}`"
                        :key="index"
                        :route="{ name: link.name }"
                        >
                        <template slot="title">
                            <div class="outline-icon">
                                <i class="material-icons-outlined">{{ link.icon }}</i>
                            </div>
                            <div class="applicant-type">{{ link.text }}</div>
                        </template>
                        <el-menu-item-group
                        class="sub-nav"
                        :router="true"
                          >
                            <template v-for="(sub, i) in link.subMenu">
                                <el-menu-item
                                class="sub-nav-text"
                                :class="{ 'is-active': sub.name === currentRoute }"
                                :index="`${link.name}/${sub.name}`"
                                :key="i"
                                :route="{ name: sub.name }"
                                v-if="applicantCategory === sub.category"
                                >
                                <div class="applicant-type">{{ sub.text }}</div>
                                <div
                                    class="applicant-count text-right"
                                    v-show="currentRoute === sub.name"
                                >{{ applicantCount }}</div>
                                </el-menu-item>
                            </template>
                        </el-menu-item-group>
                    </el-submenu>
                </template>
            </el-menu>
            <el-menu
            :default-active="currentRoute"
            class="el-menu-vertical-demo footer-links"
             >
                <template v-for="(link, index) in footerLinks">
                    <el-menu-item
                        class="nav-text"
                        v-if="!link.hasChild"
                        @click="logout()"
                        :index="`${link.name}`"
                        :key="index"
                    >
                            <i :class="`${link.icon}`"></i>
                            <span>{{ link.text }}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
import GeneralMxn from '../../mixins/general_mixin';

export default {
    name: 'Navigation',
    mixins: [GeneralMxn],
    props: ['currentRoute', 'applicantCount'],
    methods: {
        logout () {
            axios.post(`${AUTH_URL}logout`, { refresh_token: localStorage.refresh_token }).then(response => {
                localStorage.clear();
                this.$router.replace('/');
            });
        },
    },

};
</script>

<style>

</style>
