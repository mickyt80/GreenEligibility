start -> 
	/region -> 
		/check-answers (when "outside of the uk" is the /region answer) ->
			/result (not eligible)
		/Ownership (when any other answer is the /region answer) ->
			/check-answers (when any "Rent" answer) ->
				/result (not eligible)
			/main-residence (when "Own (with or without mortgage)") ->
				/check-answers (when "Secondary home") ->
					/result (not eligible)
				/built-before-2000 (when "First home") ->
					/check-answers (when "No") ->
						/result (not eligible)
					/epc-rating (when "Yes") ->
						/check-answers ->
							/result (eligible for D, E, F, G or Not known; not eligible for A, B or C)
