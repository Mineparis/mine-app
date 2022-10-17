export const formatMenu = (menusRaw) => {
	if (!menusRaw) {
		return [
			{
				title: 'Box',
				link: '/box'
			},
			{
				title: 'women',
				megamenu: [],
				position: 'static',
			},
			{
				title: 'men',
				megamenu: [],
				position: 'static',
			},
			{
				title: 'Magazine',
				link: '/magazine'
			},
			{
				title: 'about_us',
				link: '/about-us',
			},
		];
	}

	const menuByGender = menusRaw.map(({ gender, menu }) => ({
		title: gender,
		position: 'static',
		megamenu: menu,
	}));

	const box = {
		title: 'box',
		link: '/box'
	};

	const defaultMenu = [
		{
			title: 'Magazine',
			link: '/magazine'
		},
		{
			title: 'about_us',
			link: '/about-us'
		},
	];

	return [box, ...menuByGender, ...defaultMenu];
};