const generalMxn = {
    data() {
        return {
            links: [{
                    icon: 'el-icon-menu',
                    text: 'Pending Applicants',
                    name: 'pending',
                    title: 'Pending Applicants',
                    singleView: 'applicant',
                    hasChild: true,
                    subMenu: [{
                            icon: 'mdi-message-outline',
                            text: 'Owners',
                            name: 'applications',
                            title: 'Pending - Owners',
                            singleView: 'applicant',

                        },
                        {
                            icon: 'mdi-message-outline',
                            text: 'Drivers',
                            name: 'driver-applications',
                            title: 'Pending - Drivers',
                            singleView: 'driver',
                        },
                    ],
                },
                {
                    icon: 'el-icon-menu',
                    text: 'Inconsistencies',
                    name: 'inconsistencies',
                    title: 'Inconsistencies',
                    singleView: 'inconsistency',
                    hasChild: false,
                },
                {
                    icon: 'el-icon-menu',
                    text: 'Reviewed',
                    name: 'reviewed',
                    title: 'Reviewed -  All Applications',
                    singleView: 'reviewed-applicant',
                    hasChild: true,
                    subMenu: [{
                            icon: 'mdi-message-outline',
                            text: 'All',
                            name: 'reviewed',
                            title: 'Reviewed - All Applications',
                            singleView: 'reviewed-applicant',

                        },
                        {
                            icon: 'mdi-message-outline',
                            text: 'Recommended',
                            name: 'recommended',
                            title: 'Reviewed - Recommended',
                            singleView: 'reviewed-applicant',

                        },
                        {
                            icon: 'mdi-message-outline',
                            text: 'Not Recommended',
                            name: 'not-recommended',
                            title: 'Reviewed - Not Recommended',
                            singleView: 'reviewed-applicant',
                        },
                    ],
                },
            ],
            footerLinks: [{
                icon: 'el-icon-menu',
                text: 'Logout',
                name: 'logout',
                hasChild: false,
            }],
            linkDetails: null,
            routeTitle: 'Pending',
            routeIDName: null,
            options: [{
                value: 'all',
                label: 'All Applicants',
            }, {
                value: 'Owner',
                label: 'Owners',
            }, {
                value: 'Driver',
                label: 'Driver',
            }, {
                value: 'Driver and owner',
                label: 'Driver & Owner',
            }, {
                value: 'Vehicle',
                label: 'New Vehicles',
            }],
        };
    },
    watch: {
        $route() {
            this.routeDetails(this.$route.name);
        },
        linkDetails(data) {
            this.routeTitle = data.title;
            this.routeIDName = data.name;
        },
    },
    methods: {
        routeDetails(item) {
            let name = item === 'not-recommended' || item === 'recommended' ? 'reviewed' : item;
            name = name === 'driver-applications' || name === 'applications' || name === 'vehicles' ? 'pending' : name;
            let linkArr = this.links.filter((link) => link.name === name);
            let linkDetails = linkArr.length > 0 ? linkArr[0] : null;
            const hasChild = linkDetails !== null ? linkDetails.hasChild : false;

            if (hasChild) {
                const subMenu = linkDetails.subMenu;
                linkArr = subMenu.filter((m) => m.name === item);
                linkDetails = linkArr.length > 0 ? linkArr[0] : null;
            }
            linkDetails = linkArr.length > 0 ? linkArr[0] : null;
            this.linkDetails = linkDetails;
            return this.linkDetails;
        },
        capitalizeFirstLetter(string) {
            return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
        },

    },
};
export default generalMxn;
