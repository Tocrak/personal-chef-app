Vue.component('modal', {
    props: ['modal_type'],
    data: function() {
        return {'display_values': {
            'login': {
               'header': 'Log In',
               'footer_button1': 'Log In',
               'footer_button2': 'Sign Up'
            },
            'register': {
                'header': 'Sign Up',
                'footer_button1': 'Sign Up',
                'footer_button2': 'Log In'
             },
            'reset_password': {
                'header': 'Reset Password',
                'footer_button1': 'Reset',
                'footer_button2': 'Cancel'
             },
            'update_password': {
                'header': 'Update Password',
                'footer_button1': 'Update',
                'footer_button2': 'Cancel'
             },
            'submit_info': {
                'header': 'Provide Information',
                'footer_button1': 'Submit',
                'footer_button2': 'Cancel'
             },
            'delete_account': {
                'header': 'Delete Account',
                'footer_button1': 'Delete',
                'footer_button2': 'Cancel'
             }
            },
            'type': this.modal_type
        }
    },
    template: `
<transition name="modal">
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>{{ display_values[type].header }}</h3>
                </div>

                <div class="modal-body">
                    <div v-if='type === "login"'>
                        <form class="modal-form" id="login_form">
                            <span>Username:</span>
                            <input type="text" name="username">
                            <span>Password:</span>
                            <input type="text" name="password">
                        </form>
                    </div>

                    <div v-if='type === "register"'>
                        <form class="modal-form" id="register_form">
                            <span>Username:</span>
                            <input type="text" name="username">
                            <span>Password:</span>
                            <input type="text" name="password1">
                            <span>Repeat Password:</span>
                            <input type="text" name="password2">
                        </form>
                    </div>

                    <div v-if='type === "update_password"'>
                        <form class="modal-form" id="update_password_form">
                            <span>Old Password:</span>
                            <input type="text" name="password0">
                            <span>New Password:</span>
                            <input type="text" name="password1">
                            <span>Repeat New Password:</span>
                            <input type="text" name="password2">
                        </form>
                    </div>

                    <div v-if='type === "submit_info"'>
                        <form class="modal-form" id="submit_info_form">
                            <span>Age:</span>
                            <input type="text" name="age">
                            <span>Weight:</span>
                            <input type="text" name="weight">
                            <span>Height:</span>
                            <input type="text" name="height">
                            <span>Gender:</span>
                            <div>
                                <input type="radio" id="male" name="gender" value="M">
                                <label for="male">Male</label>
                                <input type="radio" id="female" name="gender" value="G">
                                <label for="female">Female</label>
                            </div>
                            <span>Goal:</span>
                            <div class="modal-form-radio">
                                <div>
                                    <input type="radio" id="lose" name="goal" value="L">
                                    <label for="lose">Lose Weight</label>
                                </div>
                                <div>
                                    <input type="radio" id="maintain" name="goal" value="M">
                                    <label for="maintain">Maintain</label>
                                </div>
                                <div>
                                    <input type="radio" id="gain" name="goal" value="G">
                                    <label for="gain">Build Muscle</label>
                                </div>
                            </div>
                            <span>Bodyfat:</span>
                            <div class="modal-form-radio">
                                <div>
                                    <input type="radio" id="low" name="bodyfat" value="10">
                                    <label for="low">Low (under 14%)</label>
                                </div>
                                <div>
                                    <input type="radio" id="medium" name="bodyfat" value="20">
                                    <label for="medium">Medium (14% to 22%)</label>
                                </div>
                                <div>
                                    <input type="radio" id="high" name="bodyfat" value="30">
                                    <label for="high">High (above 22%)</label>
                                </div>
                            </div>
                            <span>Activity Level:</span>
                            <div class="modal-form-radio">
                                <div>
                                    <input type="radio" id="sedentary" name="activity_level" value="1.2">
                                    <label for="sedentary">Sedentary</label>
                                </div>
                                <div>
                                    <input type="radio" id="light" name="activity_level" value="1.375">
                                    <label for="light">Lightly Active</label>
                                </div>
                                <div>
                                    <input type="radio" id="moderate" name="activity_level" value="1.55">
                                    <label for="moderate">Moderately Active</label>
                                </div>
                                <div>
                                    <input type="radio" id="very" name="activity_level" value="1.725">
                                    <label for="very">Very Active</label>
                                </div>
                                <div>
                                    <input type="radio" id="extreme" name="activity_level" value="1.9">
                                    <label for="extreme">Extremely Active</label>
                                </div>
                            </div>

                            <!--
                            Diet:
                            <div>
                                <input type="radio" id="anything" name="preset_diet" value="anything">
                                <label for="anything">Anything</label>
                                <input type="radio" id="paleo" name="preset_diet" value="paleo">
                                <label for="paleo">Paleo</label>
                                <input type="radio" id="vegetarian" name="preset_diet" value="vegetarian">
                                <label for="vegetarian">Vegetarian</label>
                                <input type="radio" id="vegan" name="preset_diet" value="vegan">
                                <label for="vegan">Vegan</label>
                                <input type="radio" id="ketogenic" name="preset_diet" value="atkins / ketogenic">
                                <label for="ketogenic">Ketogenic</label>
                                <input type="radio" id="mediterranean" name="preset_diet" value="mediterranean">
                                <label for="mediterranean">Mediterranean</label>
                            </div>
                            -->
                        </form>
                    </div>

                    <div v-if='type === "delete_account"'>
                        <form id="delete_account_form">
                            <span>Password:</span>
                            <input type="text" name="password">
                        </form>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="modal-default-button, modal-button-left" v-on:click="buttonAction(0)">
                        {{ display_values[type].footer_button1 }}
                    </button>
                    <button class="modal-default-button, modal-button-right" v-on:click="buttonAction(1)">
                        {{ display_values[type].footer_button2 }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</transition>`,
    created: function () {
        
    },
    methods: {
        buttonAction: function(index) {
            switch (this.type) {
                case "login":
                    form_data = document.getElementById('login_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {"username": form_data.username.value, "password": form_data.password.value});
                    } else {
                        this.type = "register";
                    }
                break;
                case "register":
                    form_data = document.getElementById('register_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {"username": form_data.username.value,
                         "password1": form_data.password1.value, "password2": form_data.password2.value});
                    } else {
                        this.type = "login";
                    }
                break;
                case "reset_password":
                    form_data = document.getElementById('reset_password_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {"email": 0});
                    } else {
                        this.$emit('close');
                    }
                break;
                case "update_password":
                    form_data = document.getElementById('update_password_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {"password0": form_data.password0.value,
                         "password1": form_data.password1.value, "password2": form_data.password2.value});
                    } else {
                        this.$emit('close');
                    }
                break;
                case "submit_info":
                    form_data = document.getElementById('submit_info_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {
                            "age": form_data.age.value, "weight": form_data.weight.value, "height": form_data.height.value,
                            "gender": form_data.gender.value, "goal": form_data.goal.value, "bodyfat": form_data.bodyfat.value,
                            "activity_level": form_data.activity_level.value, "preset_diet": "anything", "weight_goal": null,
                            "weight_goal_weekly_value": null
                        });
                    } else {
                        this.$emit('close');
                    }
                break;
                case "delete_account":
                    form_data = document.getElementById('delete_account_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {"password": form_data.password.value});
                    } else {
                        this.$emit('close');
                    }
                break;
            }
        }
    }

})
