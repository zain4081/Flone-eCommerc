import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useGetPostsMutation } from "../../services/blogApi";
import CustomFilter from "../../wrappers/blog/CustomFilter";
import { CSVLink } from "react-csv";
import convertHtmlToPlainText from "../utils/HtmlConvert";


import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet, Font, Table, TableCell, TableBody, TableRow} from '@react-pdf/renderer';


const BlogReport = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState(null);
  const { pathname = "" } = useLocation();
  const [getPosts] = useGetPostsMutation();
  const user_info = useSelector((state) => state.user);

  const fetchData = async () => {
    try {
      const p_url = `posts/?paginate=false${search && search.length > 0 ? search : ''}`;
      const response = await getPosts(p_url);
      if (response.data) {
        const dataWithSerial = response.data.map((post, index) => ({
          ...post,
          serial: index + 1,
          content: convertHtmlToPlainText(post.content),
          date: new Date(post.date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
          })
        }));
        setPosts(dataWithSerial);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleFilterChange = (filterId) => {
    setSearch(filterId);
  };

  const headers = [
    { label: 'Title', key: 'title' },
    { label: 'Content', key: 'content' },
    { label: 'Likes', key: 'likes_count' },
    { label: 'Comments', key: 'comments_count' },
    { label: 'Tags', key: 'tags_name' },
    { label: 'Date', key: 'date' }
  ];

  return (
    <Fragment>
      <SEO
        titleTemplate="Blog"
        description="Blog of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Blog", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row flex-row-reverse">
              <div className="col-lg-3">
                <CustomFilter onFilterChange={handleFilterChange} />
              </div>
              <div className="col-lg-9">
                <CSVLink data={posts} headers={headers} filename={"blog_report.csv"}>
                  Export CSV
                </CSVLink>
                <PDFDownloadLink document={<PDFDocument posts={posts} generatedBy={user_info.name} role={user_info.role} />} fileName={`blog_report_${new Date().toISOString()}.pdf`}>
                  {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Export PDF')}
                </PDFDownloadLink>
                <div className="ml-20">
                  <div className="row">
                    <table className="blog-posts-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Content</th>
                          <th>Likes</th>
                          <th>Comments</th>
                          <th>Tags</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts && posts.map(post => (
                          <tr key={post.id}>
                            <td>{post.title}</td>
                            <td>{post.content}</td>
                            <td>{post.likes_count}</td>
                            <td>{post.comments_count}</td>
                            <td>{post.tags_name.join(', ')}</td>
                            <td>{post.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};



const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 20,
  },
  header: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 20,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderCollapse: 'collapse',
    fontSize: 8,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
  },
});

// Define PDF document component
const PDFDocument = ({ posts, generatedBy, role }) => {
  const now = new Date().toLocaleString();


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>FLONE. - React Minimalist e-Commerce Template</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Blog Report</Text>
          <Text style={styles.header}>Generated by: {generatedBy} | {role}</Text>
          <Text style={styles.header}>Date Printed at: {now}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Title</Text>
              <Text style={styles.tableCell}>Content</Text>
              <Text style={styles.tableCell}>Likes</Text>
              <Text style={styles.tableCell}>Comments</Text>
              <Text style={styles.tableCell}>Tags</Text>
              <Text style={styles.tableCell}>Date</Text>
            </View>
            {posts.map(post => (
              <View key={post.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{post.title}</Text>
                <Text style={styles.tableCell}>{post.content}</Text>
                <Text style={styles.tableCell}>{post.likes_count}</Text>
                <Text style={styles.tableCell}>{post.comments_count}</Text>
                <Text style={styles.tableCell}>{post.tags_name.join(', ')}</Text>
                <Text style={styles.tableCell}>{post.date}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.footer}>
          <Text>FLONE. - React Minimalist e-Commerce Template</Text>
        </View>
      </Page>
    </Document>
  );
};



export default BlogReport;
