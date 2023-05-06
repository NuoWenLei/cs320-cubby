import GroupInterface from '@/components/GroupInterface';
import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GroupItem from '@/components/GroupItem';

describe('GroupInterface Render', () => {
  test('render', async () => {
	render(GroupInterface({
			group: {
				feature_dist: [0.1, 0.2, 0.3],
				friend_group: true,
				member_ids: [],
				name: "open similarity"
			},
			userMap: {}
	}));
	
	const searchText = await screen.findByText("open similarity");
	const featureDistText1 = await screen.findByText(`Question 1: 10.0%`);
	const featureDistText3 = await screen.findByText(`Question 3: 30.0%`);
	expect(searchText).toBeVisible();
	expect(featureDistText1).toBeVisible();
	expect(featureDistText3).toBeVisible();
  })
});

describe('GroupItem Render', () => {
	test('render', async () => {
	  render(GroupItem({
			  group: {
				  feature_dist: [0.1, 0.2, 0.3],
				  friend_group: true,
				  member_ids: ["a", "b", "c"],
				  name: "open similarity"
			  }
	  }));
	  
	  const searchText = await screen.findByText("open similarity");
	  const membersText = await screen.findByText(`Number of members: 3`);

	  expect(searchText).toBeVisible();
	  expect(membersText).toBeVisible();
	})

	test('render empty group', async () => {
		render(GroupItem({
				group: {}
		}));
		
		const searchText = await screen.findByText("No name");
		const membersText = await screen.findByText(`Number of members: 0`);
  
		expect(searchText).toBeVisible();
		expect(membersText).toBeVisible();
	  })
  });
