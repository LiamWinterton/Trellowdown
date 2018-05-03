export class TrellowdownOptions {
    static setup() {
        jQuery("#navigation-toggle").on("click", function(event) {
            TrellowdownOptions.setNavigation(jQuery(this).prop("checked"))
        })

        TrellowdownOptions.setDefaults()
    }

    static setDefaults() {
        const preference = localStorage.getItem("td_navigation_toggle")

        if(preference === "true") {
            this.setNavigation(true)
        } else {
            this.setNavigation(false)
        }
    }

    static setNavigation(value) {
        if(value === true) {
            jQuery(".trellowdown-menu").show()
            jQuery("#navigation-toggle").prop('checked', true)
            localStorage.setItem("td_navigation_toggle", true)
        } else {
            jQuery(".trellowdown-menu").hide()
            jQuery("#navigation-toggle").prop('checked', false)
            localStorage.setItem("td_navigation_toggle", false)
        }
    }
}