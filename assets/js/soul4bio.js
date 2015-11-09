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
					var logM = 1.0324 - (0.19077 * Math.log10(this.waist - this.neck));
					var logH = 0.15456 * Math.log10(this.height);
					this.pgc = Math.floor((495 / (logM + logH)) - 450);
				} else {
					var logM = 1.29579 - (0.35004 * Math.log10((this.waist + this.hip) - this.neck));
					var logH = 0.22100 * Math.log10(this.height);
					console.log(logM);
					console.log(logH);
					this.pgc = Math.floor((495 / (logM + logH)) - 450);
				}
				return this.pgc;
			},
			getMuscleMass: function() {
				return this.weight * (100 - getFatPercentage());
			},
			getMetabolicIndex: function() {
				console.log(this.gender);
				if (this.gender === '1') {
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
			if (user.waistHeight.toFixed(2) > 0.5) {
				$('#waistIndex').parent().find('p').addClass('visible');
			}

			$('#pgc').text(user.pgc + ' %');

		});

})();

