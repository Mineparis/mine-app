export const formatMenu = (menusRaw) => {
	if (!menusRaw) {
		return [
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
				title: 'about_us',
				link: '/about-us'
			},
		];
	}

	const menuByGender = menusRaw.map(({ gender, menu }) => ({
		title: gender,
		position: 'static',
		megamenu: menu,
	}));

	const defaultMenu = [
		// {
		// 	title: 'box',
		// 	link: '/box'
		// },
		{
			title: 'about_us',
			link: '/about-us'
		},
		// {
		// 	title: 'Blog',
		// 	link: '/blog'
		// }
	];

	return [...menuByGender, ...defaultMenu];
};