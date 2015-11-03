var soul4bio = (function(){
	//components initialization
		$('.tabular.menu .item').tab();

		var Parameters = {
			firstname: '',
			lastname: '',
			age: '',
			weight: '',
			height: '',
			gender: '',
			rc: '',
			factivity: '',
			objective:'',
			waist: '',
			hip: '',
			neck: '',
			method: '',
			getIMC: function() {
				this.height = this.height / 100;
				return (this.weight / (this.height * this.height)).toFixed(2);
			},
			getWaistHeightIndex: function() {
				return this.waist / this.height;
			},
			getFatPercentage: function(gender){
				var total = 0;
				if (this.gender === 1) {
					total = 495/(1.0324-0.19077(Math.log(this.waist-this.neck))+0.15456(Math.log(this.height)))-450;
				} else {
					total = 495/(1.29579-0.35004(Math.log(this.waist+this.hip-this.neck))+0.22100(Math.log(this.height)))-450;
				}
				return total;
			}
		};

		//Actions
		$('#btnParameters').click(function(event){
			var $inputs = $('#formParameters :input');
			var values = {};

			$inputs.each(function() {
        values[this.name] = $(this).val();
    	});

    	console.log(values);

			var user = Object.create(Parameters);
			user.height = values.height;
			user.weight = values.weight;
			user.waist = values.waist;
			user.gender = values.gender;
			user.hip = values.hip;
			user.neck = values.neck;
			user.firstname = values.firstname;
			user.lastname = values.lastname;
			user.age = values.age;
			user.ppm = values.ppm;
			user.faf = values.faf;
			user.objective = values.objevtive;
			user.nmet = values.nmet;

			//Response values asignation
			$( "#imc" ).text(user.getIMC());

			
		});

})();

