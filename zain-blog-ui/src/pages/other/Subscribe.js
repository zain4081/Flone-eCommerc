import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useGetPlansMutation } from '../../services/blogApi';
import { getToken } from '../../services/localStorageService';
import { useSelector } from 'react-redux';
import { useAddSubscriptionCheckoutMutation } from '../../services/commerceApi';


const Container = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
`;

const Heading = styled.h1`
  text-align: center;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
`;

const CardBody = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h5`
  font-size: 1.25rem;
  margin-bottom: 10px;
`;

const CardText = styled.p`
  color: #555;
`;

const SelectButton = styled(Link)`
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border: 1px solid #007bff;
  border-radius: 4px;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
`;

const SubscriptionPage = () => {
  const { access_token } = getToken();
  const [getPlans, { isLoading, isError, isSuccess, data: plans, error }] = useGetPlansMutation();
  const [addCheckout] = useAddSubscriptionCheckoutMutation();
  const currency = useSelector((state) => state.currency);

  useEffect(() => {
    getPlans({ 'access_token': access_token });
  }, [getPlans]);

  const handleButtonClick = (priceId) => {
    const bodyData = {
      'price_id': priceId,
    }
    addCheckout({'data': bodyData, 'access_token': access_token}).then(response => {
      console.log("response checkout", response)
      window.location.replace(response.data);
    })
    .catch(error => {
      console.error('Error during checkout:', error);
    });
  };

  return (
    <Fragment>
      <Container>
        <Heading>Subscription Plans</Heading>
      </Container>
      {isLoading ? (
        <p>Loading plans...</p>
      ) : isError ? (
        <p>Error fetching plans</p>
      ) : (
        <CardContainer>
          {plans && plans.map((plan) => (
            <Card key={plan.id}>
              <CardBody>
                <CardTitle>{plan.name}</CardTitle>
                <CardText>{currency.currencySymbol}{plan.price}</CardText>
                <SelectButton onClick={() => handleButtonClick(plan.price_id)}>
                  Select {plan.name} Plan
                </SelectButton>
              </CardBody>
            </Card>
          ))}
        </CardContainer>
      )}
    </Fragment>
  );
};

export default SubscriptionPage;
