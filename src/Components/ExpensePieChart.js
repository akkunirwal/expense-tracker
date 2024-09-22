import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = ({ selectedTrip }) => {
	const items = Object.keys(selectedTrip.expenses[0].categories);

	// Calculate the total amount spent per item
	const totalPerItem = items.map(item => {
		return selectedTrip.expenses.reduce((sum, expense) => sum + expense.categories[item], 0);
	});

	// Calculate the grand total
	const grandTotal = totalPerItem.reduce((sum, amount) => sum + amount, 0);

	// Generate chart data
	const data = {
		labels: items,
		datasets: [
			{
				data: totalPerItem.map(amount => ((amount / grandTotal) * 100).toFixed(2)), // Convert to percentages
				backgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56',
					'#4BC0C0',
					'#9966FF',
					'#FF9F40'
				],
				hoverBackgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56',
					'#4BC0C0',
					'#9966FF',
					'#FF9F40'
				]
			}
		]
	};

	return (
		<div className='mt-3 mb-2'>
			<h3>% of Total Money Spent on Item</h3>
			<Pie data={data} />
		</div>
	);
};

export default ExpensePieChart;
