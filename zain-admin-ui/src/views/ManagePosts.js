import { Card, CardHeader, CardBody, CardTitle, CardText } from "reactstrap";
import { useGetPostsMutation } from "../services/blogApi";
import { useEffect, useState } from "react";

const ManagePosts = () => {
    const [ getPosts ] = useGetPostsMutation();
    const fetchData = async () => {
      try{
        const response = await getPosts();
        const data = response.results;
        console.log("data", data);

      }
      catch(error){
        console.log(error)
      }
    }
  useEffect(() =>{
    fetchData();
  },[])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Posts</CardTitle>
      </CardHeader>
      <CardBody>
        <CardText>This is your second page.</CardText>
        <CardText>
          Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin.
          Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie
          wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.
        </CardText>
      </CardBody>
    </Card>
  );
};

export default ManagePosts;
