import React, { useState } from 'react';

// Mock data
const initialData = {
	"trips": [
		{
			"tripName": "Trip to Goa",
			"expenses": [
				{
					"date": "2024-09-18",
					"categories": {
						"food": 200,
						"fare": 100,
						"rent": 1200,
						"misc": 150
					}
				},
				{
					"date": "2024-09-19",
					"categories": {
						"food": 250,
						"fare": 80,
						"rent": 1200,
						"misc": 100
					}
				}
			]
		},
		{
			"tripName": "Trip to Manali",
			"expenses": [
				{
					"date": "2024-09-20",
					"categories": {
						"food": 300,
						"fare": 150,
						"rent": 1000,
						"misc": 200
					}
				},
				{
					"date": "2024-09-21",
					"categories": {
						"food": 220,
						"fare": 90,
						"rent": 1000,
						"misc": 180
					}
				}
			]
		}
	]
};

const formatDate = (dateString) => {
	const options = { day: 'numeric', month: 'long' };
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', options);
};

const ExpenseTracker = () => {
	const [trips, setTrips] = useState(initialData.trips);
	const [selectedTrip, setSelectedTrip] = useState(trips[0]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState({ dateIndex: 0, category: "", value: 0 });

	const handleTripChange = (e) => {
		const trip = trips.find(t => t.tripName === e.target.value);
		setSelectedTrip(trip);
	};

	const handleOpenModal = (dateIndex, category) => {
		setModalData({ dateIndex, category, value: 0 });
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleExpenseChange = (e) => {
		setModalData({ ...modalData, value: e.target.value });
	};

	const handleSubmitExpense = () => {
		const updatedTrips = trips.map(trip => {
			if (trip.tripName === selectedTrip.tripName) {
				const updatedExpenses = trip.expenses.map((expense, index) => {
					if (index === modalData.dateIndex) {
						return {
							...expense,
							categories: {
								...expense.categories,
								[modalData.category]: expense.categories[modalData.category] + Number(modalData.value)
							}
						};
					}
					return expense;
				});
				return { ...trip, expenses: updatedExpenses };
			}
			return trip;
		});

		setTrips(updatedTrips);
		setSelectedTrip({ ...selectedTrip, expenses: updatedTrips.find(t => t.tripName === selectedTrip.tripName).expenses });
		setIsModalOpen(false);  // Close the modal after adding expense
	};

	const items = ["food", "fare", "rent", "misc"];
	const dates = selectedTrip.expenses.map((expense) => formatDate(expense.date));

	const totals = {
		rows: {},
		columns: Array(dates.length).fill(0),
		grandTotal: 0
	};

	items.forEach((item) => {
		totals.rows[item] = 0;
	});

	selectedTrip.expenses.forEach((expense, dateIndex) => {
		items.forEach((item) => {
			totals.rows[item] += expense.categories[item];
			totals.columns[dateIndex] += expense.categories[item];
			totals.grandTotal += expense.categories[item];
		});
	});

	return (
		<div>
			<h2>Expense Tracker</h2>

			<label htmlFor="tripSelect">Select Trip: </label>
			<select id="tripSelect" onChange={handleTripChange}>
				{trips.map((trip, index) => (
					<option key={index} value={trip.tripName}>{trip.tripName}</option>
				))}
			</select>

			<h3>{selectedTrip.tripName}</h3>

			<table border="1" cellPadding="10">
				<thead>
					<tr>
						<th>Items</th>
						{dates.map((date, index) => (
							<th key={index}>{date}</th>
						))}
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{items.map((item, rowIndex) => (
						<tr key={rowIndex}>
							<td>{item.charAt(0).toUpperCase() + item.slice(1)}</td>
							{selectedTrip.expenses.map((expense, dateIndex) => (
								<td key={dateIndex}>
									{expense.categories[item]}
									<button onClick={() => handleOpenModal(dateIndex, item)}>Add</button>
								</td>
							))}
							<td>{totals.rows[item]}</td>
						</tr>
					))}
				</tbody>
				<tfoot>
					<tr>
						<td>Total</td>
						{totals.columns.map((total, index) => (
							<td key={index}>{total}</td>
						))}
						<td>{totals.grandTotal}</td>
					</tr>
				</tfoot>
			</table>

			{isModalOpen && (
				<div className="modal" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: 'white', border: '1px solid #ccc' }}>
					<h4>Add Expense for {modalData.category.charAt(0).toUpperCase() + modalData.category.slice(1)}</h4>
					<label>
						Amount:
						<input type="number" value={modalData.value} onChange={handleExpenseChange} />
					</label>
					<br />
					<button onClick={handleSubmitExpense}>Add Expense</button>
					<button onClick={handleCloseModal}>Cancel</button>
				</div>
			)}
		</div>
	);
};

export default ExpenseTracker;
