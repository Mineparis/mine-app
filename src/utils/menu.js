export const formatMenu = (menusRaw) => {
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