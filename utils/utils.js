//Removing sensitive data
export function prepareUserResponse (user) {
        user._doc ? delete user._doc.otp : delete user.otp;
        user._doc ? delete user._doc.password : delete user.password;
        user._doc ? delete user._doc.token : delete user.token;
        
        return user._doc ? user._doc : user
}
