if ($('#register-form').length) {
    $("#register-form").validate({
        rules: {
            fname: { required: true },
            lname: { required: true },
            privacy: { required: true },
            term: { required: true },
            email: { required: true, email: true },

            text_password: { required: true, minlength: 9 },
            password: { required: true, minlength: 9, equalTo: '#password' },
        },
        messages: {
            text_password: { minlength: 'Your password needs to contain at least 9 characters <br><br> For tips on how to create a secure password, please click <a target="_blank " href="https://www.theBoozly.com/create-a-secure-password.html">here</a>.<br>' },
            password: { minlength: 'Your password needs to contain at least 9 characters <br><br> For tips on how to create a secure password, please click <a target="_blank " href="https://www.theBoozly.com/create-a-secure-password.html">here</a>.<br>'  , equalTo: 'Sorry, but your passwords do not match. Please try again.' },
            privacy: { required: 'Please accept our Privacy Policy' },
            term: { required: 'Please accept our Terms & Conditions' },

        },
        errorPlacement: function ( error, element )
		{
			if ( element.prop( "type" ) === "checkbox" )
			{
				error.insertAfter( element.next( "label" ) );
			}
			else
			{
				error.insertAfter( element );
			}
		},

    });

};

if ($('#myaccounts').length) {
    $("#myaccounts").validate({
        rules: {
            email: { required: true, email: true },
            text_password: { required: true },
            fname: { required: true },
            lname: { required: true },
            phone: { required: true, digits: true },
        },
        messages: {
            password: { minlength: 'Your password needs to contain at least 9 characters <br><br> For tips on how to create a secure password, please click <a target="_blank " href="https://www.theBoozly.com/create-a-secure-password.html">here</a>.<br>' },
        }

    });

};



if ($('#addressform').length) {
    $("#addressform").validate({
        rules: {
            address1: { required: true },
            city: { required: true },
            country: { required: true },
            post_code: { required: true },
            phone: { required: true, digits: true },
        },

    });

};






if ($('#login-form').length) {
    $("#login-form").validate({
        rules: {
            email: { required: true, email: true },
            md5password: { required: true },
        },
        messages: {
            password: { minlength: 'Your password needs to contain at least 9 characters <br><br> For tips on how to create a secure password, please click <a target="_blank " href="https://www.theBoozly.com/create-a-secure-password.html">here</a>.<br>' },
        }

    });

};