import React, { useEffect, useState } from 'react';
import { Row, Col, Space, Button, Tabs, Layout } from 'antd';
import TabularView from '../Components/tabularView';
import ExtendedView from '../Components/extendedView';
import PlaneView from '../Components/planeView';
import AppHeader from '../Components/appHeader';
import FlightSummary from '../Components/flightSummary';
import FlightMenu from "../Components/flightMenu";
import { FlightApi } from '../APIs/FlightApi';
const { Header, Content } = Layout;

function ViewPage({ type, flightId }) {
    const [rosterExist, setRosterExist] = useState(true);
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
            children: <PlaneView type={2} flightCrew={dataSourceFlightCrew} cabinCrew={dataSourceCabinCrew} passengers={dataSourcePassenger} />,
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
    useEffect(() => {
        FlightApi.getFlightRoster(flightId).then((response) => {


            const flightSource = [
                ...flightCrewMapping(response.flight_crew_junior, 'Junior'),
                ...flightCrewMapping(response.flight_crew_senior, 'Senior'),
                ...flightCrewMapping(response.flight_crew_trainee, 'Trainee')
            ];

            dataSourceFlightCrew(flightSource);

            // Cabin crew transformation


            const cabinSource = [
                ...cabinCrewMapping(response.flight_cabin_crew_junior, 'Regular', 'Junior'),
                ...cabinCrewMapping(response.flight_cabin_crew_senior, 'Chief', 'Senior'),
                ...cabinCrewMapping(response.flight_cabin_crew_chef, 'Chef', 'Senior')
            ];

            dataSourceCabinCrew(cabinSource);

            // Passenger transformation
            const passengerSource = response.flight_passengers.map((passengerData, index) => {
                const { passenger, seat_no } = passengerData;
                return {
                    key: index.toString(),
                    passengerId: passenger.id.toString(),
                    flightId: 'FLIGHT_ID', // Replace 'FLIGHT_ID' with actual flight ID if available
                    name: passenger.name,
                    age: passenger.age,
                    gender: passenger.gender,
                    nationality: passenger.nationality,
                    seatType: seatTypleCalculator(type, passenger.seat_no),
                };
            });
            setDataSourcePassenger(passengerSource);

            // SOrrrrrrrrruuuuuuuuuuuuuuun
            const menuSource = response.flight_menu.map((item, index) => ({
                key: index,
                id: item.id,
                dish: item.dish
            }));

            setMenu(menuSource);
        });
    }, []);
    useEffect(() => {
        if (false) {
            getFlightRoster(1).then((response) => {
                console.log(response);
                setRosterCreated(response);
            });
        }

    }, [rosterExist]);
    return (
        <Layout>
            <Header style={{
                backgroundColor: '#ebebeb',
                paddingLeft: '15px',
                paddingRight: '15px',
                zIndex: 3,
                boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)"
            }}>
                <AppHeader username='USER' />
            </Header>
            <Content >
                <FlightSummary departurePoint='Bengaluru (BLR)' departureDate='Mon, 14 Jun 2021' returnPoint='New Delhi (Del)' returnDate='Fri, 18 Jun 2021' />
                <Tabs style={{ padding: '0 50px' }} size='large' defaultActiveKey="1" items={items} />
                <FlightMenu menu={menu} />
                <Space style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 50px' }}>
                    <Button type="primary">CONFIRM</Button>
                    <Button type="primary">EXPORT</Button>
                </Space>
            </Content>
        </Layout >
    );
}
export default ViewPage