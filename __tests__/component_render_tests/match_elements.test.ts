import Matchbar from '@/components/Matchbar';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GroupItem from '@/components/GroupItem';
import MatchInterface from '@/components/MatchInterface';

describe('Matchbar Render', () => {
  test('render', async () => {
	render(Matchbar({
		items: [
			{similarity_matched: 0.5},
			{similarity_matched: 0.3},
			{similarity_matched: 0.7},
			{}
		],
		index: 0,
		setIndex: (num: number) => null
	}));
	
	const simText1 = await screen.findByText(`50.0%`);
	const simText2 = await screen.findByText(`70.0%`);
	const noSimText = await screen.findByText("0%");
	expect(simText1).toBeVisible();
	expect(simText2).toBeVisible();
	expect(noSimText).toBeVisible();
  })
});

describe('MatchInterface Render', () => {
	test('render', async () => {
	  render(MatchInterface({
		invite: {similarity_matched: 0.5},
		group: {
			feature_dist: [0.1, 0.2, 0.3],
			friend_group: true,
			member_ids: ["a", "b", "c"],
			name: "hellooooo"
		},
		joinGroup: (async (arg1: string | undefined, arg2: string | undefined) => {}),
		rejectGroup: async (arg1: string | undefined) => {},
		loading: false,
		setLoading: (arg: boolean) => {},
	  }));
	  
	  const searchText = await screen.findByText("hellooooo");
	  const simText = await screen.findByText(`50.0%`);
	  const qText = await screen.findByText("Question 1: 10.0%");

	  expect(searchText).toBeVisible();
	  expect(simText).toBeVisible();
	  expect(qText).toBeVisible();
	})
  });
