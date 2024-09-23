import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = ({ selectedTrip }) => {
	const items = Object.keys(selectedTrip.expenses[0].categories);

	const totalPerItem = items.map(item => {
		return selectedTrip.expenses.reduce((sum, expense) => sum + expense.categories[item], 0);
	});

	const grandTotal = totalPerItem.reduce((sum, amount) => sum + amount, 0);

	const data = {
		labels: items,
		datasets: [
			{
				data: totalPerItem.map(amount => ((amount / grandTotal) * 100).toFixed(2)),
				backgroundColor: [
					'#FF6384', // Vivid Red
					'#FFCE56', // Bright Yellow
					'#FF5733', // Vivid Orange
					'#33FF57', // Neon Green
					'#FF9F40', // Bright Tangerine
					'#9966FF', // Bright Purple
					'#FF334A', // Bright Coral
					'#FF1F8E', // Bright Pink
					'#3DFF5D', // Bright Lime Green
					'#FF951F', // Bright Amber
					'#8A2BE2', // Blue Violet
					'#FF4500', // Orange Red
					'#00CED1', // Dark Turquoise
				]
				,
				hoverBackgroundColor: [
					'#FF6384', // Vivid Red
					'#FFCE56', // Bright Yellow
					'#FF5733', // Vivid Orange
					'#33FF57', // Neon Green
					'#FF9F40', // Bright Tangerine
					'#9966FF', // Bright Purple
					'#FF334A', // Bright Coral
					'#FF1F8E', // Bright Pink
					'#3DFF5D', // Bright Lime Green
					'#FF951F', // Bright Amber
					'#8A2BE2', // Blue Violet
					'#FF4500', // Orange Red
					'#00CED1', // Dark Turquoise
				]
			}
		]
	};

	const options = {
		plugins: {
			tooltip: {
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				titleColor: '#fff',
				bodyColor: '#fff',
				borderColor: '#fff',
				borderWidth: 1,
				padding: 15,
				displayColors: false,
				callbacks: {
					label: (tooltipItem) => {
						const percentage = Number(tooltipItem.raw).toFixed(2) + '%';
						return `${percentage}`;
					}
				}
			}
		}
	};

	return (
		<div className='mt-3 mb-2'>
			<h3>% of Total Money Spent on Item</h3>
			<Pie data={data} options={options} />
		</div>
	);
};

export default ExpensePieChart;
