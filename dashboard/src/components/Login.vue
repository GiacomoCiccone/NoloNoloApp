<template>
<div class="vertical-center">
    <div class="bg-image">
        <div class="inner-block" >      
            <div class="vue-tempalte">
                <form @submit.prevent="onSubmit">
                    <h3>Sign In</h3>

                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" name="email" v-model="email" class="form-control form-control-lg" />
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input name="password" v-model="password" class="form-control form-control-lg" />
                    </div>
                    <br>
                    <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>

                    <p class="forgot-password text-right mt-2 mb-4">
                        <!-- <a href="/forgotPassword">Forgot password ?<a> -->
                    </p>

                </form>

                <p v-if="error">{{error}}</p>
            </div>
        </div>
    </div>    
</div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'Login',
        data () {
            return {
                email: '',
                password: '',
                error: null,
            }
        },

        beforeMount() {
            if (window.localStorage.getItem("authTokenManager")) this.$router.push({path: '/dashboard'});
        },
        methods: {
        async onSubmit() {

        const body = {
                email: this.email,
                password: this.password
            }

        try {

            const {data} = await axios.put('http://localhost:8000/api/auth/loginManager', body);
            window.localStorage.setItem("authTokenManager", data.data.authToken);
            window.localStorage.setItem("userInfoManager", data.data.userInfo);

            this.$router.push({path: '/dashboard'});

        } catch(error) {
            try {
                const {data} = await axios.post('http://localhost:8000/api/auth/registerManager', body);

                window.localStorage.setItem("authTokenManager", data.data.authToken);
                window.localStorage.setItem("userInfoManager", data.data.userInfo);

                this.$router.push({path: '/dashboard'});

            } catch (error) {
                this.error = error.response.data.error
                setTimeout(() => {
                    this.error = null;
                }, 5000)
            }
        }
    }
        }
    }
</script>