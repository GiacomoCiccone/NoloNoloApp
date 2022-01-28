<template>
<div class="vertical-center">
    <div class="bg-image">
        <div class="inner-block" >      
            <div class="vue-tempalte">
                <form>
                    <h3>Sign In</h3>

                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" name="email" class="form-control form-control-lg" />
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" name="password" class="form-control form-control-lg" />
                    </div>
                    <br>
                    <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>

                    <p class="forgot-password text-right mt-2 mb-4">
                        <router-link to="/forgot-password">Forgot password ?</router-link>
                    </p>

                </form>

                <p v-if="showError" id="error">Username or Password is incorrect</p>
            </div>
        </div>
    </div>    
</div>
</template>

<script>
    export default {
        //name: 'Login'
    }
</script>