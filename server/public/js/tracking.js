jQuery.ajax({
			type: 'POST',
			url: ./api,
			data: {
				action: 'get_share_counts',
			},
			success: function (data) {
				if (!data.success) {
					console.log(data.data);
				}
				else {
					

				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.log(errorThrown);
			}
		});