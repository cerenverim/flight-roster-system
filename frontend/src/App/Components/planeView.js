import { React, useState, useEffect, useRef } from "react";
import { Tooltip, Row, Col, Card, Space, Typography } from "antd";
import Icon from '@ant-design/icons';
function PlaneView({ type, flightCrew, cabinCrew, passengers }) {
    const seat = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="35px" width="35px" version="1.1" id="Layer_1" viewBox="0 0 512 512" >
        <g transform="translate(1 1)">
            <g>
                <g>
                    <path d="M442.733,204.653h-57.398l-7.455-135.68C376.173,29.72,343.747-1,304.493-1h-98.987     c-39.253,0-70.827,30.72-73.387,69.973L124.685,203.8H67.267c-9.387,0-17.067,7.68-17.067,17.067v17.067     C50.2,247.32,57.88,255,67.267,255v93.867c0,14.507,11.093,25.6,25.6,25.6h8.533V383c0,5.12,3.413,8.533,8.533,8.533h25.6V485.4     c0,14.507,11.093,25.6,25.6,25.6c14.507,0,25.6-11.093,25.6-25.6v-93.867h136.533V485.4c0,14.507,11.093,25.6,25.6,25.6     c14.507,0,25.6-11.093,25.6-25.6v-93.867h25.6c5.12,0,8.533-3.413,8.533-8.533v-8.533h8.533c14.507,0,25.6-11.093,25.6-24.747     V255c9.387,0,17.067-7.68,17.067-16.213V221.72C459.8,212.333,452.12,204.653,442.733,204.653z M205.507,16.067h98.987     c29.867,0,54.613,23.893,56.32,53.76l9.538,175.779c-0.099,0.531-0.152,1.097-0.152,1.715l2.07,33.644l0.472,8.695     c-0.578-0.089-1.161-0.161-1.747-0.228c-1.496-0.29-3.276-0.297-5.062-0.297H144.067c-1.786,0-3.566,0.007-5.062,0.297     c-0.586,0.067-1.169,0.139-1.747,0.228l2.278-41.984c0.102-0.392,0.195-0.792,0.264-1.207l1.707-34.133     c0-0.147-0.015-0.308-0.028-0.467l7.708-142.04C150.893,39.96,175.64,16.067,205.507,16.067z M67.267,220.867h56.32     l-0.853,17.067H75.8h-8.533V220.867z M92.867,357.4c-5.12,0-8.533-3.413-8.533-8.533V255h37.528l-0.171,3.097l-2.37,38.716     c-0.153,0.118-0.296,0.245-0.448,0.364c-10.648,7.692-17.472,20.224-17.472,34.623v25.6H92.867z M169.667,485.4     c0,5.12-3.413,8.533-8.533,8.533s-8.533-3.413-8.533-8.533v-93.867h17.067V485.4z M357.4,485.4c0,5.12-3.413,8.533-8.533,8.533     c-5.12,0-8.533-3.413-8.533-8.533v-93.867H357.4V485.4z M391.533,374.467h-25.6H331.8H178.2h-34.133h-25.6v-8.533V331.8     c0-0.571,0.021-1.14,0.058-1.704c0.002-0.035,0.005-0.069,0.007-0.104c0.383-5.449,2.487-10.538,5.776-14.762     c1.576-1.895,3.43-3.544,5.508-4.897c0.711-0.113,1.506-0.321,2.305-0.721c2.064-1.548,4.442-2.464,6.94-2.953     c0.269-0.05,0.539-0.096,0.81-0.138c0.131-0.021,0.263-0.04,0.395-0.058c0.345-0.048,0.692-0.091,1.042-0.126     c0.122-0.012,0.244-0.02,0.367-0.03c0.325-0.028,0.65-0.054,0.979-0.071c0.47-0.022,0.942-0.037,1.413-0.037h221.867     c0.472,0,0.943,0.015,1.413,0.037c0.329,0.017,0.654,0.043,0.979,0.071c0.122,0.01,0.245,0.019,0.367,0.03     c0.35,0.035,0.697,0.078,1.042,0.126c0.132,0.018,0.264,0.038,0.395,0.058c0.272,0.042,0.542,0.089,0.81,0.138     c2.499,0.489,4.877,1.405,6.94,2.953c0.352,0.234,0.722,0.43,1.101,0.6c7.337,4.134,11.907,11.53,12.488,19.788     c0.002,0.03,0.005,0.06,0.006,0.09c0.038,0.566,0.058,1.136,0.058,1.709v34.133V374.467z M425.667,348.867     c0,5.12-3.413,8.533-8.533,8.533H408.6v-25.6c0-0.829-0.028-1.651-0.073-2.468c-0.017-0.311-0.045-0.618-0.068-0.927     c-0.037-0.487-0.077-0.973-0.129-1.455c-0.043-0.403-0.095-0.804-0.149-1.204c-0.048-0.348-0.099-0.694-0.155-1.039     c-0.078-0.493-0.162-0.983-0.256-1.47c-0.029-0.149-0.063-0.296-0.094-0.444c-2.199-10.719-8.268-19.938-16.996-25.98L388.12,255     h37.547V348.867z M442.733,237.933h-55.467l-0.853-17.067h56.32V237.933z" />
                    <path d="M173.933,79.213c5.12,0.853,9.387-2.56,9.387-7.68c0.853-11.947,10.24-21.333,22.187-21.333h98.987     c11.947,0,21.333,9.387,22.187,21.333c0,4.267,4.267,7.68,8.533,7.68c5.12,0,8.533-4.267,8.533-8.533     c-0.853-21.333-17.92-37.547-39.253-37.547h-98.987c-20.48,0-38.4,16.213-39.253,36.693     C165.4,74.947,168.813,79.213,173.933,79.213z" />
                </g>
            </g>
        </g>
    </svg>);
    const SeatIcon = (props) => <Icon component={seat} {...props} />
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
        {
            key: '8',
            passengerId: 'W77304D849',
            flightId: 'G45678H901',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            seatType: 'Economy',
            seat: '24'
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

    const generateRowsPassenger = (rowCount, seatsPerSide, businessCount) => {
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
                        const isBusinessSeat = seat <= businessCount;
                        return (
                            <Card
                                key={seatIndex}
                                style={{
                                    textAlign: 'center',
                                    backgroundColor: isBusinessSeat ? (passenger ? '#8d8d00' : '#ffff00') : (passenger ? '#c0c0c0' : '#ffffff'),
                                }}
                            >

                                {passenger ? (
                                    <Tooltip title={passenger.passengers.map(p => `${p.name}, ${p.age}`).join('-')}>
                                        <SeatIcon />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Empty">
                                        <SeatIcon />
                                    </Tooltip>
                                )}
                                <p>{seat}</p>
                            </Card>
                        );
                    })}
                </Space>
                <Space>
                    {row.slice(seatsPerSide).map((seat, seatIndex) => {
                        const passenger = combinedPassengers.find((passenger) => passenger.seat === seat.toString());

                        const isBusinessSeat = seat <= businessCount;
                        return (
                            <Card
                                key={seatIndex}
                                style={{
                                    textAlign: 'center',
                                    backgroundColor: isBusinessSeat ? (passenger ? '#8d8d00' : '#ffff00') : (passenger ? '#c0c0c0' : '#ffffff'),
                                }}
                            >
                                {passenger ? (
                                    <Tooltip title={passenger.passengers.map(p => `${p.name}, ${p.age}`).join('-')}>
                                        <SeatIcon />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Empty">
                                        <SeatIcon />
                                    </Tooltip>
                                )}
                                <p>{seat}</p>
                            </Card>
                        );
                    })}
                </Space>
            </Space>
        ));
    };
    const generateRowsFlight = (pilotCount) => {
        const rows = [];
        if (pilotCount === 2 || pilotCount === 4) {
            const rowSeats = [];
            for (let j = 0; j < pilotCount; j++) {
                rowSeats.push(j);
            }
            rows.push(rowSeats);
        }
        else {
            for (let i = 0; i < 2; i++) {
                const rowSeats = [];
                for (let j = i * 4; j < i * 4 + 4; j++) {
                    rowSeats.push(j);
                }
                rows.push(rowSeats);
            }
        }
        return rows.map((row, rowIndex) => (
            <Space key={rowIndex} style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '10px' }}>
                <Space>
                    {row.map((seat, seatIndex) => {
                        const pilot = flightCrew[seat];
                        return (
                            <Card
                                key={seatIndex}
                                style={{
                                    textAlign: 'center',
                                    backgroundColor: pilot ? '#005f95' : '#00a2ff',
                                }}
                            >
                                {pilot ? (
                                    <Tooltip title={`${pilot.name}, ${pilot.age}`}>
                                        <SeatIcon />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Empty">
                                        <SeatIcon />
                                    </Tooltip>
                                )}
                            </Card>
                        );
                    })}
                </Space>
            </Space>
        ));
    }
    const generateRowsCabin = (attendantCount) => {
        const rows = [];
        if (attendantCount === 6) {
            const rowSeats = [];
            for (let j = 0; j < 6; j++) {
                rowSeats.push(j);
            }
            rows.push(rowSeats);
        }
        else if (attendantCount === 12) {
            for (let i = 0; i < 2; i++) {
                const rowSeats = [];
                for (let j = i * 6; j < i * 6 + 6; j++) {
                    rowSeats.push(j);
                }
                rows.push(rowSeats);
            }
        }
        else {
            for (let i = 0; i < 2; i++) {
                const rowSeats = [];
                for (let j = i * 6; j < i * 6 + 6; j++) {
                    rowSeats.push(j);
                }
                rows.push(rowSeats);
            }
            for (let i = 0; i < 2; i++) {
                const rowSeats = [];
                for (let j = 12 + i * 4; j < 12 + i * 4 + 4; j++) {
                    rowSeats.push(j);
                }
                rows.push(rowSeats);
            }
        }
        return rows.map((row, rowIndex) => (
            <Space key={rowIndex} style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '10px' }}>
                <Space>
                    {row.map((seat, seatIndex) => {
                        const attendant = cabinCrew[seat];
                        return (
                            <Card
                                key={seatIndex}
                                style={{
                                    textAlign: 'center',
                                    backgroundColor: attendant ? '#824100' : '#ff7f00',
                                }}
                            >
                                {attendant ? (
                                    <Tooltip title={`${attendant.name}, ${attendant.age}`}>
                                        <SeatIcon />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Empty">
                                        <SeatIcon />
                                    </Tooltip>
                                )}
                            </Card>
                        );
                    })}
                </Space>
            </Space>
        ));
    }


    return (
        <>
            {type === 1 ? (
                <Space key="type-1" direction="vertical" style={{ width: '60%', margin: '0px 50px ' }}>
                    <Typography.Title style={{ textAlign: 'center' }} level={4}>Flight Crew</Typography.Title>
                    {generateRowsFlight(2)}
                    <Typography.Title style={{ textAlign: 'center' }} level={4}>Cabin Crew</Typography.Title>
                    {generateRowsCabin(6)}
                    <Typography.Title style={{ textAlign: 'center' }} level={4}>Passengers</Typography.Title>
                    {generateRowsPassenger(10, 1, 20)}
                </Space>
            ) : type === 2 ? (
                <Space key="type-2" direction="vertical" style={{ width: '60%', margin: '0px 50px ' }}>
                    <Typography.Title style={{ textAlign: 'center' }} level={4}>Flight Crew</Typography.Title>
                    {generateRowsFlight(4)}
                    <Typography.Title style={{ textAlign: 'center' }} level={4}>Cabin Crew</Typography.Title>
                    {generateRowsCabin(12)}
                    <Typography.Title style={{ textAlign: 'center' }} level={4}>Passengers</Typography.Title>
                    {generateRowsPassenger(20, 2, 20)}
                </Space>
            ) : (
                <Space key="type-3" direction="vertical" style={{ width: '60%', margin: '0px 50px ' }}>
                    <Typography.Title style={{ textAlign: 'center' }} level={4}>Flight Crew</Typography.Title>
                    {generateRowsFlight(8)}
                    <Typography.Title style={{ textAlign: 'center' }} level={4}>Cabin Crew</Typography.Title>
                    {generateRowsCabin(20)}
                    <Typography.Title style={{ textAlign: 'center' }} level={4}>Passengers</Typography.Title>
                    {generateRowsPassenger(30, 3, 60)}
                </Space>
            )}
        </>
    );
};

export default PlaneView;
