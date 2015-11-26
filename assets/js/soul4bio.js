	var soul4bio = (function(){
	//components initialization
		$('.tabular.menu .item').tab();
		$('.ui.accordion').accordion();
		$('.popup').popup({inline: true});

	// Calculations
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
			proteinsLevel: '',
			imcData: {},
			macros: {},
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
					var logM = 1.0324 - (0.19077 * Math.log10(Number(this.waist) - Number(this.neck)));
					var logH = 0.15456 * Math.log10(this.height);
					this.pgc = Math.floor((495 / (logM + logH)) - 450);
				} else {
					var logM = 1.29579 - (0.35004 * Math.log10(Number(this.waist) + Number(this.hip) - Number(this.neck)));
					var logH = 0.22100 * Math.log10(this.height);
					this.pgc = Math.floor((495 / (logM + logH)) - 450);
				}
				return this.pgc;
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
			getMcm: function() {
				return (Number(this.weight) * (100 - this.getFatPercentage())) / 100;
			},
			getCob: function() {
				var calories = this.getMetabolicIndex();
				if (this.objective === '1') {
					calories = calories - 500;
				} else if (this.objective === '2') {
					calories = calories + 500;
				}
				return calories;
			},
			getMacros: function(totalCalories) {
				console.log('Calorias', totalCalories);
				var macros = {};
				var protein ='';
				var proteinsKcal = 0;
				var carbs = '';
				var carbsKcal = 0;
				var fat = '';
				var fatsKcal = 0;
				var proteinsPercentage = 0;
				var fatPercentage = 0;
				var carbsPercentage = 0;
				console.log(this.proteinsLevel);
				if (this.proteinsLevel === '1') {
					protein = (this.mcm * 2.2) * 0.825;
				} else if (this.proteinsLevel === '2') {
					protein = (this.mcm * 2.2) * 1.2;					
				} else {
					protein = (this.mcm * 2.2) * 1.5;
				}
				
				protein = Math.ceil(protein);
				fatsKcal = totalCalories * 0.25;
				fat = Math.ceil(fatsKcal / 9);
				fatsPercentage = ((fatsKcal / totalCalories) * 100).toFixed(2);
				proteinsKcal = Math.ceil(protein * 4);
				proteinsPercentage = ((proteinsKcal / totalCalories) * 100).toFixed(2);
				carbsKcal = totalCalories - (proteinsKcal + fatsKcal);
				carbs = Math.ceil(carbsKcal / 4);
				carbsPercentage = ((carbsKcal / totalCalories) * 100).toFixed(2);
				
				var totalMeals ={totalx3: this.getCaloriesxMeal(totalCalories,3),
												 totalx4: this.getCaloriesxMeal(totalCalories,4),
												 totalx5: this.getCaloriesxMeal(totalCalories,5)};

				var carbMeals = {carbsx3: this.getCaloriesxMeal(carbs,3),
												 carbsx4: this.getCaloriesxMeal(carbs,4),
												 carbsx5: this.getCaloriesxMeal(carbs,5)};
			  var proteinMeals = {proteinx3: this.getCaloriesxMeal(protein,3),
												proteinx4: this.getCaloriesxMeal(protein,4),
												proteinx5: this.getCaloriesxMeal(protein,5)};
			  var fatMeals = {fatx3: this.getCaloriesxMeal(fat,3),
												fatx4: this.getCaloriesxMeal(fat,4),
												fatx5: this.getCaloriesxMeal(fat,5)};

				macros = {fat:fat, fatKcal: fatsKcal, fatP: fatsPercentage,
									fatx3:fatMeals.fatx3,fatx4:fatMeals.fatx4,fatx5:fatMeals.fatx5,
								 carbs:carbs, carbsKcal: carbsKcal, carbsP: carbsPercentage,
								 carbsx3:carbMeals.carbsx3, carbsx4:carbMeals.carbsx4,carbsx5:carbMeals.carbsx5,
								 protein:protein, proteinsKcal: proteinsKcal, proteinsP:proteinsPercentage,
								 proteinx3:proteinMeals.proteinx3,proteinx4:proteinMeals.proteinx4,proteinx5:proteinMeals.proteinx5,
								 totalx3:totalMeals.totalx3, totalx4:totalMeals.totalx4, totalx5:totalMeals.totalx5 };
				return macros;

			},
			getCaloriesxMeal: function(calories, meals) {
				return Math.ceil(calories / meals);
			}
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
			user.proteinsLevel = values.proteinsLevel;
			user.valImc = user.getIMC();
			user.valImb = user.getMetabolicIndex();
			user.waistHeight = user.getWaistHeightIndex();
			user.pgc = user.getFatPercentage();
			user.mcm = user.getMcm();
			user.cob = user.getCob();
			user.macros = user.getMacros(user.cob);

			//Response values asignation

			$('#imc').text(user.valImc.IMC + ' - ' + user.valImc.rating);
			$('#imb').text(user.valImb + ' Kcal');
			$('#waistIndex').text(user.waistHeight.toFixed(2));
			if (user.waistHeight.toFixed(2) > 0.5) {
				$('#waistIndex').parent().find('p').addClass('visible');
			}
			$('#pgc').text(user.pgc + ' %');
			$('#mcm').text(user.getMcm() + ' Kg');
			$('#cob').text(user.cob + ' Kcal');
			$('#protein').text(user.macros.protein + ' gr - ' + user.macros.proteinsKcal +  ' Kcal - ' + user.macros.proteinsP + '%');
			$('#carbs').text(user.macros.carbs + ' gr - '+ user.macros.carbsKcal +  ' Kcal - ' + user.macros.carbsP + '%');
			$('#fat').text(user.macros.fat + ' gr - '+ user.macros.fatKcal +  ' Kcal - ' + user.macros.fatP + '%');
			$('#cob3').text(user.macros.totalx3 + ' Kcal');
			$('#cob4').text(user.macros.totalx4 + ' Kcal');
			$('#cob5').text(user.macros.totalx5 + ' Kcal');
			$('#carbs3').text(user.macros.carbsx3 + ' gr');
			$('#carbs4').text(user.macros.carbsx4 + ' gr');
			$('#carbs5').text(user.macros.carbsx5 + ' gr');
			$('#protein3').text(user.macros.proteinx3 + ' gr');
			$('#protein4').text(user.macros.proteinx4 + ' gr');
			$('#protein5').text(user.macros.proteinx5 + ' gr');
			$('#fat3').text(user.macros.fatx3 + ' gr');
			$('#fat4').text(user.macros.fatx4 + ' gr');
			$('#fat5').text(user.macros.fatx5 + ' gr');
			
			 $('html, body').animate({
        	scrollTop: $("#results").offset().top
    		}, 1000);
		});

})();

