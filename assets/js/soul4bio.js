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
			activity: '',
			objective:'',
			waist: '',
			hip: '',
			neck: '',
			method: '',
			imcData: {},
			imb: '',
			pgc: '',
			getIMC: function() {
				var modHeight = this.height / 100;
				this.imcData.IMC = (this.weight / (modHeight * modHeight)).toFixed(2);
				if (this.imcData.IMC <= 18.5) {
					this.imcData.rating = 'Debajo del peso normal';
				}
				if ((this.imcData.IMC > 18.5) && (this.imcData.IMC <= 24.9)) {
					this.imcData.rating = 'Peso Normal';
				}
				if ((this.imcData.IMC > 25) && (this.imcData.IMC <= 29.9)) {
					this.imcData.rating = 'Sobrepeso';
				}
				if (this.imcData.IMC > 30) {
					this.imcData.rating = 'Obesidad';
				}
				return this.imcData;
			},
			getWaistHeightIndex: function() {
				return this.waist / this.height;
			},
			getFatPercentage: function(){
				if (this.gender === '1') {
					var logWn = Math.log(this.waist - this.neck);
					var logH = Math.log(this.height);
					var logWnRes = (1.0324 - 0.19077) * logWn;
					var logHSum = 0.15456 * logH;
					this.pgc = 495 / ((logWnRes + logHSum ) - 450);
				} else {
					this.pgc = 495 / (1.29579 - 0.35004(Math.log(this.waist + this.hip - this.neck)) + 0.22100(Math.log(this.height))) - 450;
				}
				return this.pgc;
			},
			getMuscleMass: function() {
				return this.weight * (100 - getFatPercentage());
			},
			getMetabolicIndex: function() {
				console.log(this.gender);
				if (this.gender === '1') {
					console.log(this.weight);
					console.log(this.height);
					this.imb = ((10 * this.weight) + (6.25 * this.height) - (5 * this.age) + 5);
					console.log(this.imb);
				} else {
					this.imb = ((10 * this.weight) + (6.25 * this.height) - (5 * this.age) - 161);
				}
				return Math.ceil(this.imb * Number(this.activity));
			},
		}

		//Actions
		$('#btnParameters').click(function(event){
			var $inputs = $('#formParameters :input');
			var values = {};

			$inputs.each(function() {
        values[this.name] = $(this).val();
    	});

			//localStorage.setItem('userData', values);


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
			user.activity = values.activity;
			user.objective = values.objective;
			user.nmet = values.nmet;
			user.valImc = user.getIMC();
			user.valImb = user.getMetabolicIndex();
			user.waistHeight = user.getWaistHeightIndex();
			user.pgc = user.getFatPercentage();

			//Response values asignation

			$('#imc').text(user.valImc.IMC + ' - ' + user.valImc.rating);
			$('#imb').text(user.valImb + ' Kcal');
			$('#waistIndex').text(user.waistHeight.toFixed(2));
			$('#pgc').text(user.pgc + ' %');

		});

})();

