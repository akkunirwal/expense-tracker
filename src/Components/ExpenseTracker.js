import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ExpenseTracker.css';

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
	const options = { day: 'numeric', month: 'short' };
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
	const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
	const [isEditDateModalOpen, setIsEditDateModalOpen] = useState(false);
	const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
	const [newEventName, setNewEventName] = useState('');
	const [modalData, setModalData] = useState({ dateIndex: 0, category: "", currentValue: 0, addValue: 0 });
	const [newItem, setNewItem] = useState("");
	const [newDate, setNewDate] = useState("");
	const [selectedItemIndex, setSelectedItemIndex] = useState(null);
	const [selectedDateIndex, setSelectedDateIndex] = useState(null);
	const [newItemName, setNewItemName] = useState('');
	const [newExpenseDate, setNewExpenseDate] = useState('');

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

	const handleAddItem = () => {
		if (newItem) {
			const updatedExpenses = selectedTrip.expenses.map((expense) => ({
				...expense,
				categories: { ...expense.categories, [newItem]: 0 }
			}));

			const updatedTrip = { ...selectedTrip, expenses: updatedExpenses };
			setTrips(trips.map(trip => trip.tripName === selectedTrip.tripName ? updatedTrip : trip));
			setSelectedTrip(updatedTrip);
			setNewItem("");
			setIsAddItemModalOpen(false);
		}
	};

	const handleEditItemName = () => {
		if (newItemName && selectedItemIndex !== null) {
			const updatedExpenses = selectedTrip.expenses.map((expense) => {
				const categories = { ...expense.categories };
				categories[newItemName] = categories[items[selectedItemIndex]];
				delete categories[items[selectedItemIndex]];
				return { ...expense, categories };
			});

			const updatedTrip = { ...selectedTrip, expenses: updatedExpenses };
			setTrips(trips.map(trip => trip.tripName === selectedTrip.tripName ? updatedTrip : trip));
			setSelectedTrip(updatedTrip);
			setNewItemName("");
			setIsEditItemModalOpen(false);
		}
	};

	const handleOpenEditItemModal = (index) => {
		setSelectedItemIndex(index);
		setNewItemName(items[index]);
		setIsEditItemModalOpen(true);
	};

	const handleAddDate = () => {
		if (newDate) {
			const newCategories = {};
			Object.keys(selectedTrip.expenses[0].categories).forEach((e) => newCategories[e] = 0)
			const newExpense = { date: newDate, categories: newCategories };
			const updatedExpenses = [...selectedTrip.expenses, newExpense];
			const updatedTrip = { ...selectedTrip, expenses: updatedExpenses };
			setTrips(trips.map(trip => trip.tripName === selectedTrip.tripName ? updatedTrip : trip));
			setSelectedTrip(updatedTrip);
			setNewDate("");
			setIsAddDateModalOpen(false);
		}
	};

	const handleOpenEditDateModal = (index) => {
		setSelectedDateIndex(index);
		setNewExpenseDate(selectedTrip.expenses[index].date);
		setIsEditDateModalOpen(true);
	};

	const handleEditDate = () => {
		if (newExpenseDate && selectedDateIndex !== null) {
			const updatedExpenses = selectedTrip.expenses.map((expense, index) => {
				if (index === selectedDateIndex) {
					return { ...expense, date: newExpenseDate };
				}
				return expense;
			});
			const updatedTrip = { ...selectedTrip, expenses: updatedExpenses };
			setTrips(trips.map(trip => trip.tripName === selectedTrip.tripName ? updatedTrip : trip));
			setSelectedTrip(updatedTrip);
			setNewExpenseDate("");
			setIsEditDateModalOpen(false);
		}
	};

	const handleDeleteItem = (e, item) => {
		e.stopPropagation();
		if (Object.keys(selectedTrip.expenses[0].categories).length === 1) {
			alert("You cannot delete the last item!");
			return;
		}

		const updatedExpenses = selectedTrip.expenses.map(expense => {
			const { [item]: _, ...remainingCategories } = expense.categories;
			return { ...expense, categories: remainingCategories };
		});

		const updatedTrip = { ...selectedTrip, expenses: updatedExpenses };
		setTrips(trips.map(trip => trip.tripName === selectedTrip.tripName ? updatedTrip : trip));
		setSelectedTrip(updatedTrip);
	};

	const handleDeleteDate = (e, index) => {
		e.stopPropagation();
		if (selectedTrip.expenses.length === 1) {
			alert("You cannot delete the last date!");
			return;
		}

		const updatedExpenses = selectedTrip.expenses.filter((_, i) => i !== index);
		const updatedTrip = { ...selectedTrip, expenses: updatedExpenses };
		setTrips(trips.map(trip => trip.tripName === selectedTrip.tripName ? updatedTrip : trip));
		setSelectedTrip(updatedTrip);
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

	const addEventHandler = () => {
		if (!newEventName) {
			alert('Please fill in all fields.');
			return;
		}
		let tripObj = {
			"tripName": newEventName,
			"expenses": [
				{
					"date": "2024-09-20",
					"categories": {
						"fare": 1000,
					}
				}
			]
		}
		setTrips((prev) => (
			[...prev, tripObj]
		))
		setNewEventName('');
		setIsNewEventModalOpen(false);
	};

	const handleDeleteEvent = (e) => {
		if (trips.length > 1) {
			setTrips((prevTrips) => {
				const updatedTrips = prevTrips.filter((t) => t.tripName !== selectedTrip.tripName);
				// Set the new selected trip only if trips remain
				if (updatedTrips.length > 0) {
					setSelectedTrip(updatedTrips[0]);
				}
				return updatedTrips;
			});
		}
	};


	return (
		<div className="container mt-4">
			<h2>Expense Tracker</h2>
			<select className="select" onChange={handleTripChange}>
				{trips.map((trip, index) => (
					<option key={index} value={trip.tripName}>
						{trip.tripName}
					</option>
				))}
			</select>
			<i className="bi bi-trash" onClick={(e) => handleDeleteEvent(e)} style={{ cursor: 'pointer', marginLeft: '8px' }}></i>
			<div className="mb-3 d-flex mt-4 justify-content-between">
				<button
					type="button"
					className="btn btn-primary me-2"
					data-bs-toggle="modal"
					data-bs-target="#addEventModal"
					onClick={() => setIsNewEventModalOpen(true)}
				>
					Add Event
				</button>
				<div>
					<button className="btn btn-primary me-2" onClick={() => setIsAddItemModalOpen(true)}>Add Item</button>
					<button className="btn btn-secondary" onClick={() => setIsAddDateModalOpen(true)}>Add Day</button>
				</div>
			</div>

			<div className="tableContainer">
				<table className="table table-bordered">
					<thead>
						<tr>
							<th colSpan="2">Items</th>
							{dates.map((date, index) => (
								<th key={index} onClick={() => handleOpenEditDateModal(index)} style={{ cursor: 'pointer' }}>
									{date}
									<i className="bi bi-trash" onClick={(e) => handleDeleteDate(e, index)} style={{ cursor: 'pointer', marginLeft: '8px' }}></i>
								</th>
							))}
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item, rowIndex) => (
							<tr key={rowIndex}>
								<td colSpan="2" onClick={() => handleOpenEditItemModal(rowIndex)} style={{ cursor: 'pointer' }}>
									{item}
									<i className="bi bi-trash" onClick={(e) => handleDeleteItem(e, item)} style={{ cursor: 'pointer', marginLeft: '8px' }}></i>
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
							<td colSpan="2">Total</td>
							{totals.columns.map((total, index) => (
								<td key={index}>{total}</td>
							))}
							<td>{totals.grandTotal}</td>
						</tr>
					</tfoot>
				</table>
			</div>

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

			{/* Edit Item Modal */}
			{isEditItemModalOpen && (
				<div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Edit Item Name</h5>
								<button type="button" className="btn-close" onClick={() => setIsEditItemModalOpen(false)}></button>
							</div>
							<div className="modal-body">
								<input
									type="text"
									value={newItemName}
									onChange={(e) => setNewItemName(e.target.value)}
									placeholder="New Item Name"
									className="form-control"
								/>
							</div>
							<div className="modal-footer">
								<button className="btn btn-primary" onClick={handleEditItemName}>Update Item Name</button>
								<button className="btn btn-secondary" onClick={() => setIsEditItemModalOpen(false)}>Cancel</button>
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

			{/* Edit Date Modal */}
			{isEditDateModalOpen && (
				<div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Edit Date</h5>
								<button type="button" className="btn-close" onClick={() => setIsEditDateModalOpen(false)}></button>
							</div>
							<div className="modal-body">
								<input
									type="date"
									value={newExpenseDate}
									onChange={(e) => setNewExpenseDate(e.target.value)}
									className="form-control"
								/>
							</div>
							<div className="modal-footer">
								<button className="btn btn-primary" onClick={handleEditDate}>Update Date</button>
								<button className="btn btn-secondary" onClick={() => setIsEditDateModalOpen(false)}>Cancel</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{isNewEventModalOpen && (
				<div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Add New Event</h5>
								<button type="button" className="btn-close" onClick={() => setIsNewEventModalOpen(false)}></button>
							</div>
							<div className="modal-body">
								<input
									type="text"
									value={newEventName}
									onChange={(e) => setNewEventName(e.target.value)}
									className="form-control"
								/>
							</div>
							<div className="modal-footer">
								<button className="btn btn-primary" onClick={addEventHandler}>Add Event</button>
								<button className="btn btn-secondary" onClick={() => setIsNewEventModalOpen(false)}>Cancel</button>
							</div>
						</div>
					</div>
				</div>
			)}


		</div>
	);
};

export default ExpenseTracker;