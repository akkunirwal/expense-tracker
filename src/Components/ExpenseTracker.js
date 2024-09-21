import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Mock data
const initialData = {
	"trips": [
		{
			"tripName": "Trip to Rishikesh",
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
	const [trips, setTrips] = useState(() => {
		const savedTrips = localStorage.getItem('trips');
		return savedTrips ? JSON.parse(savedTrips) : initialData.trips;
	});

	const [selectedTrip, setSelectedTrip] = useState(trips[0]);
	const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
	const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
	const [isAddDateModalOpen, setIsAddDateModalOpen] = useState(false);
	const [modalData, setModalData] = useState({ dateIndex: 0, category: "", currentValue: 0, addValue: 0 });
	const [newItem, setNewItem] = useState("");
	const [newDate, setNewDate] = useState("");

	useEffect(() => {
		localStorage.setItem('trips', JSON.stringify(trips));
	}, [trips]);

	const handleTripChange = (e) => {
		const trip = trips.find(t => t.tripName === e.target.value);
		setSelectedTrip(trip);
	};

	const handleOpenExpenseModal = (dateIndex, category) => {
		const currentValue = selectedTrip.expenses[dateIndex].categories[category];
		setModalData({ dateIndex, category, currentValue, addValue: 0 });
		setIsExpenseModalOpen(true);
	};

	const handleCloseExpenseModal = () => {
		setIsExpenseModalOpen(false);
	};

	const handleAddValueChange = (e) => {
		setModalData({ ...modalData, addValue: e.target.value });
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
								[modalData.category]: modalData.currentValue + Number(modalData.addValue)
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
		setSelectedTrip(updatedTrips.find(t => t.tripName === selectedTrip.tripName));
		setIsExpenseModalOpen(false);
	};

	const handleItemNameChange = (index, newName) => {
		const updatedItems = { ...selectedTrip.expenses };
		const categories = { ...updatedItems[index].categories };
		const updatedTrip = { ...selectedTrip };
		updatedTrip.expenses[index].categories[newName] = categories[selectedTrip.expenses[index].categories];
		delete categories[selectedTrip.expenses[index].categories];
		setTrips(trips.map(trip => trip.tripName === selectedTrip.tripName ? updatedTrip : trip));
	};

	const handleAddItem = () => {
		if (newItem) {
			const updatedItems = selectedTrip.expenses.map(expense => ({
				...expense,
				categories: { ...expense.categories, [newItem]: 0 }
			}));
			const updatedTrip = { ...selectedTrip, expenses: updatedItems };
			setTrips(trips.map(trip => trip.tripName === selectedTrip.tripName ? updatedTrip : trip));
			setNewItem("");
			setIsAddItemModalOpen(false);
		}
	};

	const handleAddDate = () => {
		if (newDate) {
			const newExpense = { date: newDate, categories: { food: 0, fare: 0, rent: 0, misc: 0 } };
			const updatedExpenses = [...selectedTrip.expenses, newExpense];
			const updatedTrip = { ...selectedTrip, expenses: updatedExpenses };
			setTrips(trips.map(trip => trip.tripName === selectedTrip.tripName ? updatedTrip : trip));
			setSelectedTrip(updatedTrip);
			setNewDate("");
			setIsAddDateModalOpen(false);
		}
	};

	const items = Object.keys(selectedTrip.expenses[0].categories);
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
		<div className="container mt-4">
			<h2>Expense Tracker</h2>

			<div className="mb-3 d-flex mt-4 justify-content-between">
				{/* <select className="" onChange={handleTripChange}>
					{trips.map((trip, index) => (
						<option key={index} value={trip.tripName}>{trip.tripName}</option>
					))}
				</select> */}
				<h3>{selectedTrip.tripName}</h3>
				<div>
					<button className="btn btn-primary me-2" onClick={() => setIsAddItemModalOpen(true)}>Add Item</button>
					<button className="btn btn-secondary" onClick={() => setIsAddDateModalOpen(true)}>Add Date</button>
				</div>
			</div>


			<table className="table table-bordered">
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
							<td>
								{item}
							</td>
							{selectedTrip.expenses.map((expense, dateIndex) => (
								<td key={dateIndex} onClick={() => handleOpenExpenseModal(dateIndex, item)} style={{ cursor: 'pointer' }}>
									{expense.categories[item]}
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

			{/* Expense Modal */}
			{isExpenseModalOpen && (
				<div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Add Expense for {modalData.category.charAt(0).toUpperCase() + modalData.category.slice(1)}</h5>
								<button type="button" className="btn-close" onClick={handleCloseExpenseModal}></button>
							</div>
							<div className="modal-body">
								<label>Current Value: {modalData.currentValue}</label>
								<div className="mb-3">
									<label>Add Value:</label>
									<input type="number" value={modalData.addValue} onChange={handleAddValueChange} className="form-control" />
								</div>
								<label>New Value: {modalData.currentValue + Number(modalData.addValue)}</label>
							</div>
							<div className="modal-footer">
								<button className="btn btn-primary" onClick={handleSubmitExpense}>Update Expense</button>
								<button className="btn btn-secondary" onClick={handleCloseExpenseModal}>Cancel</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Add Item Modal */}
			{isAddItemModalOpen && (
				<div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Add New Item</h5>
								<button type="button" className="btn-close" onClick={() => setIsAddItemModalOpen(false)}></button>
							</div>
							<div className="modal-body">
								<input
									type="text"
									value={newItem}
									onChange={(e) => setNewItem(e.target.value)}
									placeholder="New Item Name"
									className="form-control"
								/>
							</div>
							<div className="modal-footer">
								<button className="btn btn-primary" onClick={handleAddItem}>Add Item</button>
								<button className="btn btn-secondary" onClick={() => setIsAddItemModalOpen(false)}>Cancel</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Add Date Modal */}
			{isAddDateModalOpen && (
				<div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Add New Date</h5>
								<button type="button" className="btn-close" onClick={() => setIsAddDateModalOpen(false)}></button>
							</div>
							<div className="modal-body">
								<input
									type="date"
									value={newDate}
									onChange={(e) => setNewDate(e.target.value)}
									className="form-control"
								/>
							</div>
							<div className="modal-footer">
								<button className="btn btn-primary" onClick={handleAddDate}>Add Date</button>
								<button className="btn btn-secondary" onClick={() => setIsAddDateModalOpen(false)}>Cancel</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ExpenseTracker;
