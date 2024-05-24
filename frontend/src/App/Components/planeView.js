import { React, useState, useEffect, useRef } from "react";
import { Tooltip, Row, Col, Card, Space } from "antd";

function PlaneView({ type }) {
    const [flightCrew, setFlightCrew] = useState([
        {
            key: '0',
            id: 'A78534B219',
            name: 'Marcus Giles',
            age: 25,
            gender: 'Male',
            nationality: 'French',
            languages: 'English',
            vehicleType: 'A',
            range: '1000km',
            seniorityLevel: 'Junior'
        },
        {
            key: '1',
            id: 'J78214G911',
            name: 'Leyton Christensen',
            age: 30,
            gender: 'Male',
            nationality: 'English',
            languages: 'English',
            vehicleType: 'A',
            range: '600km',
            seniorityLevel: 'Senior'
        },
        {
            key: '2',
            id: 'C71234F439',
            name: 'Viktoria Atkins',
            age: 21,
            gender: 'Female',
            nationality: 'English',
            languages: 'English, French',
            vehicleType: 'A',
            range: '1000km',
            seniorityLevel: 'Trainee'
        },
        {
            key: '3',
            id: 'K71284G243',
            name: 'Zubair Rodriguez',
            age: 35,
            gender: 'Male',
            nationality: 'German',
            languages: 'English, German',
            vehicleType: 'A',
            range: '1000km',
            seniorityLevel: 'Senior'
        },
        {
            key: '4',
            id: 'Y74834B283',
            name: 'Rowan Barron',
            age: 26,
            gender: 'Male',
            nationality: 'French',
            languages: 'English, French',
            vehicleType: 'A,B',
            range: '1000km',
            seniorityLevel: 'Trainee'
        },
        {
            key: '5',
            id: 'W77304D849',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            languages: 'English,Russian',
            vehicleType: 'C',
            range: '400km',
            seniorityLevel: 'Trainee'
        },
    ]);
    const [cabinCrew, setCabinCrew] = useState([
        {
            key: '0',
            id: 'A78534B219',
            name: 'Marcus Giles',
            age: 25,
            gender: 'Male',
            nationality: 'French',
            languages: 'English',
            attendantType: 'Regular',
            vehicleType: 'A',
            dishes: '',
            seniorityLevel: 'Junior'
        },
        {
            key: '1',
            id: 'J78214G911',
            name: 'Leyton Christensen',
            age: 30,
            gender: 'Male',
            nationality: 'English',
            languages: 'English',
            attendantType: 'Regular',
            vehicleType: 'A',
            dishes: '',
            seniorityLevel: 'Senior'
        },
        {
            key: '2',
            id: 'C71234F439',
            name: 'Viktoria Atkins',
            age: 21,
            gender: 'Female',
            nationality: 'English',
            languages: 'English, French',
            attendantType: 'Regular',
            vehicleType: 'A',
            dishes: '',
            seniorityLevel: 'Junior'
        },
        {
            key: '3',
            id: 'K71284G243',
            name: 'Zubair Rodriguez',
            age: 35,
            gender: 'Male',
            nationality: 'German',
            languages: 'English, German',
            attendantType: 'Chief',
            vehicleType: 'A',
            dishes: '',
            seniorityLevel: 'Senior'
        },
        {
            key: '4',
            id: 'Y74834B283',
            name: 'Rowan Barron',
            age: 26,
            gender: 'Male',
            nationality: 'French',
            languages: 'English, French',
            attendantType: 'Chef',
            vehicleType: 'A,B',
            dishes: 'Creme Brulee',
            seniorityLevel: 'Trainee'
        },
        {
            key: '5',
            id: 'W77304D849',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            languages: 'English,Russian',
            attendantType: 'Chef',
            vehicleType: 'C',
            dishes: 'Lava Cake',
            seniorityLevel: 'Senior'
        },
    ]);
    const [passengers, setPassengers] = useState([
        {
            key: '0',
            passengerId: 'A78534B219',
            flightId: 'X12345Y678',
            name: 'Marcus Giles',
            age: 25,
            gender: 'Male',
            nationality: 'French',
            seatType: 'Economy',
            seat: '1'
        },
        {
            key: '1',
            passengerId: 'J78214G911',
            flightId: 'M98765N432',
            name: 'Leyton Christensen',
            age: 30,
            gender: 'Male',
            nationality: 'English',
            seatType: 'Business',
            seat: '2'
        },
        {
            key: '2',
            passengerId: 'C71234F439',
            flightId: 'Q24680R135',
            name: 'Viktoria Atkins',
            age: 21,
            gender: 'Female',
            nationality: 'English',
            seatType: 'Business',
            seat: '3'
        },
        {
            key: '3',
            passengerId: 'K71284G243',
            flightId: 'S54321T987',
            name: 'Zubair Rodriguez',
            age: 35,
            gender: 'Male',
            nationality: 'German',
            seatType: 'Economy',
            seat: '3'
        },
        {
            key: '4',
            passengerId: 'Y74834B283',
            flightId: 'C98765D432',
            name: 'Rowan Barron',
            age: 26,
            gender: 'Male',
            nationality: 'French',
            seatType: 'Economy',
            seat: '5'
        },
        {
            key: '5',
            passengerId: 'W77304D849',
            flightId: 'G45678H901',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            seatType: 'Economy',
            seat: '4'
        },
        {
            key: '6',
            passengerId: 'W77304D849',
            flightId: 'G45678H901',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            seatType: 'Economy',
            seat: '6'
        },
        {
            key: '7',
            passengerId: 'W77304D849',
            flightId: 'G45678H901',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            seatType: 'Economy',
            seat: '4'
        },
        {
            key: '7',
            passengerId: 'W77304D849',
            flightId: 'G45678H901',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            seatType: 'Economy',
            seat: '12'
        },
    ]);

    const [combinedPassengers, setCombinedPassengers] = useState([]);

    useEffect(() => {
        const combinePassengersBySeat = (passengers) => {
            const seatMap = new Map();

            passengers.forEach((passenger) => {
                const seat = passenger.seat;
                if (!seatMap.has(seat)) {
                    seatMap.set(seat, {
                        seat: seat,
                        passengers: []
                    });
                }
                seatMap.get(seat).passengers.push(passenger);
            });

            return Array.from(seatMap.values());
        };

        const combined = combinePassengersBySeat(passengers);
        setCombinedPassengers(combined);
    }, [passengers]);

    const generateRows = (rowCount, seatsPerSide) => {
        const rows = [];

        let seatNumber = 1;
        for (let i = 0; i < rowCount; i++) {
            const rowSeats = [];
            for (let j = 0; j < seatsPerSide * 2; j++) {
                rowSeats.push(seatNumber++);
            }
            rows.push(rowSeats);
        }

        return rows.map((row, rowIndex) => (
            <Space key={rowIndex} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Space>
                    {row.slice(0, seatsPerSide).map((seat, seatIndex) => {
                        const passenger = combinedPassengers.find((passenger) => passenger.seat === seat.toString());
                        return (
                            <Card key={seatIndex} style={{ width: '100px', textAlign: 'center' }}>
                                <p>{seat}</p>
                                {passenger && (
                                    <Tooltip title={passenger.passengers.map((p) => p.name).join(', ')}>
                                        <p>{passenger.passengers.length} {passenger.passengers.length > 1 ? 'passengers' : 'passenger'}</p>
                                    </Tooltip>
                                )}
                            </Card>
                        );
                    })}
                </Space>
                <Space>
                    {row.slice(seatsPerSide).map((seat, seatIndex) => {
                        const passenger = combinedPassengers.find((passenger) => passenger.seat === seat.toString());
                        return (
                            <Card key={seatIndex} style={{ width: '100px', textAlign: 'center' }}>
                                <p>{seat}</p>
                                {passenger && (
                                    <Tooltip title={passenger.passengers.map((p) => p.name).join(', ')}>
                                        <p>{passenger.passengers.length} {passenger.passengers.length > 1 ? 'passengers' : 'passenger'}</p>
                                    </Tooltip>
                                )}
                            </Card>
                        );
                    })}
                </Space>
            </Space>
        ));
    };





    return (
        <>
            {type === 1 ? (
                <>{generateRows(10, 1)}</>
            ) : type === 2 ? (
                <>{generateRows(20, 2)}</>
            ) : (
                <>{generateRows(30, 3)}</>
            )}
        </>
    );
};

export default PlaneView;
