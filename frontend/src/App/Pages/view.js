import { React, useState, useEffect, useRef } from "react";
import { Space, Button, Tabs, Layout, Typography } from 'antd';
import TabularView from '../Components/tabularView';
import ExtendedView from '../Components/extendedView';
import PlaneView from '../Components/planeView';
import FlightSummary from '../Components/flightSummary';
import FlightMenu from '../Components/flightMenu';
import { FlightApi } from '../APIs/FlightApi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const { Content } = Layout;

function ViewPage() {
    const navigate = useNavigate();
    const flight = useSelector(state => state.flight.selectedFlight);
    const [dataSourceTabular, setDataSourceTabular] = useState([]);
    const [dataSourcePassenger, setDataSourcePassenger] = useState([]);
    const [dataSourceFlightCrew, setDataSourceFlightCrew] = useState([]);
    const [dataSourceCabinCrew, setDataSourceCabinCrew] = useState([]);
    const [menu, setMenu] = useState([]);
    const items = [
        {
            key: '1',
            label: 'TABULAR VIEW',
            children: <TabularView dataSource={dataSourceTabular} />,
        },
        {
            key: '2',
            label: 'PLANE VIEW',
            children: <PlaneView type={flight.vehicle_type} flightCrew={dataSourceFlightCrew} cabinCrew={dataSourceCabinCrew} passengers={dataSourcePassenger} />,
        },
        {
            key: '3',
            label: 'EXTENDED VIEW',
            children: <ExtendedView flightCrew={dataSourceFlightCrew} cabinCrew={dataSourceCabinCrew} passengers={dataSourcePassenger} />,
        },
    ];
    const cabinCrewMapping = (crew, attendantType, seniorityLevel) => crew.map((member, index) => ({
        key: index,
        id: member.id,
        name: member.name,
        age: member.age,
        gender: member.gender,
        nationality: member.nationality,
        languages: member.languages.join(', '),
        attendantType,
        vehicleType: Array.isArray(member.vehicle) ? member.vehicle.join(', ') : member.vehicle.toString(),
        dishes: member.dishes ? member.dishes.map(dish => dish.dish).join(', ') : '',
        seniorityLevel
    }));
    const flightCrewMapping = (crew, seniorityLevel) => crew.map((member, index) => ({
        key: index,
        id: member.id,
        name: member.name,
        age: member.age,
        gender: member.gender,
        nationality: member.nationality,
        languages: member.languages.join(', '),
        vehicleType: member.vehicle,
        range: member.max_range ? `${member.max_range} km` : 'N/A',
        seniorityLevel
    }));
    const seatTypleCalculator = (vehicleType, seat_no) => {
        if (vehicleType === 1) {
            return 'Business'
        }
        else if (vehicleType === 2) {
            if (seat_no <= 20) {
                return 'Business'
            }
            return 'Economy'
        }
        else {
            if (seat_no <= 60) {
                return 'Business'
            }
            return 'Economy'
        }
    }
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    useEffect(() => {
        FlightApi.getFlightRoster(flight.flight_number).then((response) => {
            if (response.length === 0) {
                FlightApi.generateFlightRoster(flight.flight_number).then((response) => {
                    if (response.length === 0) {
                        console.log('Error in generating flight roster');
                    }
                    else {
                        const flightSource = [
                            ...flightCrewMapping(response.flight_crew_junior, 'Junior'),
                            ...flightCrewMapping(response.flight_crew_senior, 'Senior'),
                            ...flightCrewMapping(response.flight_crew_trainee, 'Trainee')
                        ];

                        setDataSourceFlightCrew(flightSource);

                        // Cabin crew transformation


                        const cabinSource = [
                            ...cabinCrewMapping(response.flight_cabin_crew_junior, 'Regular', 'Junior'),
                            ...cabinCrewMapping(response.flight_cabin_crew_senior, 'Chief', 'Senior'),
                            ...cabinCrewMapping(response.flight_cabin_crew_chef, 'Chef', '')
                        ];

                        setDataSourceCabinCrew(cabinSource);

                        // Passenger transformation
                        const passengerSource = response.flight_passengers.map((passengerData, index) => {
                            const { passenger, seat_no } = passengerData;
                            return {
                                key: index.toString(),
                                passengerId: passenger.id.toString(),
                                flightId: flight.flight_number.toString(), // Replace 'FLIGHT_ID' with actual flight ID if available
                                name: passenger.name,
                                age: passenger.age,
                                gender: passenger.gender,
                                nationality: passenger.nationality,
                                seatType: seatTypleCalculator(flight.vehicle_type, passenger.seat_no),
                                seat: seat_no.toString()
                            };
                        });
                        setDataSourcePassenger(passengerSource);
                        const menuSource = response.flight_menu.map((item, index) => ({
                            key: index,
                            id: item.id,
                            dish: item.dish
                        }));
                        setMenu(menuSource);
                        let count = 0;
                        let tempData = [];
                        for (let i = 0; i < flightSource.length; i++) {
                            tempData.push({
                                key: count++,
                                id: flightSource[i].id,
                                name: flightSource[i].name,
                                type: "flight crew",
                            });
                        }
                        for (let i = 0; i < cabinSource.length; i++) {
                            tempData.push({
                                key: count++,
                                id: cabinSource[i].id,
                                name: cabinSource[i].name,
                                type: "cabin crew",
                            });
                        }
                        for (let i = 0; i < passengerSource.length; i++) {
                            tempData.push({
                                key: count++,
                                id: passengerSource[i].passengerId,
                                name: passengerSource[i].name,
                                type: "passenger",
                            });
                        }
                        console.log(tempData);
                        setDataSourceTabular(tempData);
                    }

                });
            }
            else {
                const flightSource = [
                    ...flightCrewMapping(response.flight_crew_junior, 'Junior'),
                    ...flightCrewMapping(response.flight_crew_senior, 'Senior'),
                    ...flightCrewMapping(response.flight_crew_trainee, 'Trainee')
                ];

                setDataSourceFlightCrew(flightSource);

                // Cabin crew transformation


                const cabinSource = [
                    ...cabinCrewMapping(response.flight_cabin_crew_junior, 'Regular', 'Junior'),
                    ...cabinCrewMapping(response.flight_cabin_crew_senior, 'Chief', 'Senior'),
                    ...cabinCrewMapping(response.flight_cabin_crew_chef, 'Chef', '')
                ];

                setDataSourceCabinCrew(cabinSource);

                // Passenger transformation
                const passengerSource = response.flight_passengers.map((passengerData, index) => {
                    const { passenger, seat_no } = passengerData;
                    return {
                        key: index.toString(),
                        passengerId: passenger.id.toString(),
                        flightId: flight.flight_number.toString(), // Replace 'FLIGHT_ID' with actual flight ID if available
                        name: passenger.name,
                        age: passenger.age,
                        gender: passenger.gender,
                        nationality: passenger.nationality,
                        seatType: seatTypleCalculator(flight.vehicle_type, passenger.seat_no),
                        seat: seat_no.toString()
                    };
                });
                setDataSourcePassenger(passengerSource);
                const menuSource = response.flight_menu.map((item, index) => ({
                    key: index,
                    id: item.id,
                    dish: item.dish
                }));
                setMenu(menuSource);
                let count = 0;
                let tempData = [];
                for (let i = 0; i < flightSource.length; i++) {
                    tempData.push({
                        key: count++,
                        id: flightSource[i].id,
                        name: flightSource[i].name,
                        type: "flight crew",
                    });
                }
                for (let i = 0; i < cabinSource.length; i++) {
                    tempData.push({
                        key: count++,
                        id: cabinSource[i].id,
                        name: cabinSource[i].name,
                        type: "cabin crew",
                    });
                }
                for (let i = 0; i < passengerSource.length; i++) {
                    tempData.push({
                        key: count++,
                        id: passengerSource[i].passengerId,
                        name: passengerSource[i].name,
                        type: "passenger",
                    });
                }
                console.log(tempData);
                setDataSourceTabular(tempData);
            }

        });
    }, []);

    return (
        <Layout>
            <Content >
                <FlightSummary fromPoint={flight.flight_src} departureDate={formatDate(flight.flight_date)} toPoint={flight.flight_dest} />
                <Tabs style={{ padding: '0 50px' }} size='large' defaultActiveKey="1" items={items} />
                <FlightMenu menu={menu} />
                <Space align="baseline" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 50px' }}>
                    <Space align="baseline" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0px' }}>
                        <Typography.Title level={4}>Download Roster As:</Typography.Title>
                        <Button type="primary" onClick={() => FlightApi.downloadSql(flight.flight_number)}>SQL</Button>
                        <Button type="primary" onClick={() => FlightApi.downloadNoSql(flight.flight_number)}>NoSQL</Button>
                        <Button type="primary" onClick={() => FlightApi.downloadJson(flight.flight_number)}>JSON</Button>
                    </Space>
                    <Button type="primary" onClick={() => FlightApi.deleteFlightRoster(flight.flight_number).then((response) => {
                        navigate('/');
                    })}
                    >Clear Roster</Button>
                </Space>
            </Content>
        </Layout >
    );
}
export default ViewPage