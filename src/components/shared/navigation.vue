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
                        :class="{'active-route' : link.name === activeRoute}"
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
    computed: {
        routeName () {
            return this.$route.name;
        },
        activeRoute () {
            let active = '';
           if (this.routeName === 'applications' || this.routeName === 'driver-applications' || this.routeName === 'transporters' || this.routeName === 'transporters' || this.routeName === 'freight-peer' || this.routeName === 'freight-business') {
               active = 'pending';
           } else if (this.routeName === 'inconsistencies' || this.routeName === 'freight-inconsistencies' || this.routeName === 'cop-inconsistencies' || this.routeName === 'peer-inconsistencies' || this.routeName === 'transporter-inconsistencies') {
               active = 'inconsistencies';
           } else if (this.routeName === 'reviewed' || this.routeName === 'recommended' || this.routeName === 'not-recommended' || this.routeName === 'reviewed-business' || this.routeName === 'reviewed-peer' || this.routeName === 'transporter-reviewed') {
               active = 'reviewed';
           }
           return active;
        },
    },
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
.el-submenu__title {
    width: 94%;
    border-radius: 4px;
    margin-bottom: 3px;
}
.active-route > .el-submenu__title {
    background: #e8f3fc;
    border: 3px solid #e8f3fc !important;
    border-radius: 6px;
    letter-spacing: 0.03em;
    color: #2d5c95 !important;
}
.active-route > .el-menu {
    display: block !important;
}
</style>
