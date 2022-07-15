import React, {useEffect, useRef, useState} from "react";
import {Box, Button} from "@mui/material";
import {Link} from "react-router-dom";
import {START_ROUTE} from "../../utils/consts";

const ReactPayPal = ({orderId, value, isAuth, userLink}) => {
    const [paid, setPaid] = useState(false);
    const [error, setError] = useState(null);
    const paypalRef = useRef();

    useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: `${orderId}`,
                                amount: {
                                    currency_code: "USD",
                                    value: value,
                                },
                            },
                        ],
                    });
                },
                onApprove: async (data, actions) => {
                    await actions.order.capture();

                    setPaid(true);
                },
                onError: (err) => {
                    setError(true)
                },
            })
            .render(paypalRef.current);
    }, [])


    if (paid) {
        return (<Box>
            <div>Оплата прошла успешно!</div>
            {isAuth ?
                <Link to={userLink}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button variant="outlined"
                            fullWidth
                            navigate={userLink}>
                        Перейти к заказам</Button>
                </Link> :
                <Link to={START_ROUTE}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button variant="outlined" fullWidth navigate={START_ROUTE}>На
                        главную</Button>
                </Link>
            }</Box>)
    }

    if (error) {
        return (<Box>
            <div ref={paypalRef}/>
            <div>Произошла ошибка.Можете повторить!</div>
            {isAuth ?
                <Link to={userLink}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button variant="outlined"
                            fullWidth
                            navigate={userLink}>
                        Продолжить без оплаты</Button>
                </Link> :
                <Link to={START_ROUTE}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button variant="outlined" fullWidth navigate={START_ROUTE}>На
                        главную</Button>
                </Link>
            }
        </Box>)
    }
    return (
        <div>
            <span>Можете сейчас оплатить заказ:</span>
            <div ref={paypalRef}/>
            {isAuth ?
                <Link to={userLink}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button variant="outlined"
                            fullWidth
                            navigate={userLink}>
                        Продолжить без оплаты</Button>
                </Link> :
                <Link to={START_ROUTE}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button variant="outlined" fullWidth navigate={START_ROUTE}>На
                        главную</Button>
                </Link>
            }
        </div>
    );
}
export default ReactPayPal