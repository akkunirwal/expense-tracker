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
