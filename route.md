start -> 
	/region -> 
		/check-answers (when "outside of the uk" is the /region answer) ->
			/result (not eligible)
		/Ownership (when any other answer is the /region answer) ->
			/check-answers ->
				/result (eligible)