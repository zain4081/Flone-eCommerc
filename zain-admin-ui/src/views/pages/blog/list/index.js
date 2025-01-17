// ** React Imports
import { Link } from 'react-router-dom'
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'
import classnames from 'classnames'
import { MessageSquare } from 'react-feather'


// ** Custom Components
import Sidebar from '../BlogSidebar'
import Avatar from '@components/avatar'
import Breadcrumbs from '@components/breadcrumbs'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardImg,
  Badge,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap'

// ** Styles
import '@styles/base/pages/page-blog.scss'
import axiosInstance from '../../../../interceptor/axios'

const BlogList = () => {
  // ** States
  const [data, setData] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const fetchData = async (page) => {
      try {
        let url = `/blog/posts/?p=${page ? page : ''}`;
        const response = await axiosInstance.get(url);
        console.log("response: ",response.data)
        setData(response.data.results)
        setTotalPages(response.data.total_pages)
        setNextPage(response.data.next_url !== null);
        setPrevPage(response.data.previous_url !== null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(currentPage);
  }, [currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
console.log("data", data);
  const badgeColorsArr = {
    Quote: 'light-info',
    Fashion: 'light-primary',
    Gaming: 'light-danger',
    Video: 'light-warning',
    Food: 'light-success'
  }
  const renderRenderList = () => {
    return data.map(item => {
      const renderTags = () => {
        return item.tags_name.map((tag, index) => {
          return (
            <a key={index} href='/' onClick={e => e.preventDefault()}>
              <Badge
                className={classnames({
                  'me-50': index !== item.tags_name.length - 1
                })}
                color={badgeColorsArr[tag]}
                pill
              >
                {tag}
              </Badge>
            </a>
          )
        })
      }

      return (
        <Col key={item.title} md='6'>
          <Card>
            <Link to={`/pages/blog/detail/${item.id}`}>
              <CardImg className='img-fluid' src={import.meta.env.VITE_API_URL+item.image_url} alt={item.title} top />
            </Link>
            <CardBody>
              <CardTitle tag='h4'>
                <Link className='blog-title-truncate text-body-heading' to={`/pages/blog/detail/${item.id}`}>
                  {item.title}
                </Link>
              </CardTitle>
              {/* <div className='d-flex'>
                <Avatar className='me-50' img={item.avatar} imgHeight='24' imgWidth='24' />
                <div>
                  <small className='text-muted me-25'>by</small>
                  <small>
                    <a className='text-body' href='/' onClick={e => e.preventDefault()}>
                      {item.userFullName}
                    </a>
                  </small>
                  <span className='text-muted ms-50 me-25'>|</span>
                  <small className='text-muted'>{item.blogPosted}</small>
                </div>
              </div> */}
              <div className='my-1 py-25'>{renderTags()}</div>
              <CardText className='blog-content-truncate'>{item.content}</CardText>
              <hr />
              <div className='d-flex justify-content-between align-items-center'>
                <Link to={`/pages/blog/detail/${item.id}`}>
                  <MessageSquare size={15} className='text-body me-50' />
                  <span className='text-body fw-bold'>{item.comments_count} Comments</span>
                </Link>
                <Link className='fw-bold' to={`/pages/blog/edit/${item.id}`}>
                  Edit
                </Link>
                <Link className='fw-bold' to={`/pages/blog/detail/${item.id}`}>
                  Read More
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      )
    })
  }

  return (
    <Fragment>
      <Breadcrumbs title='Blog List' data={[{ title: 'Pages' }, { title: 'Blog' }, { title: 'List' }]} />
      <div className='blog-wrapper'>
        <div className='content-detached content-left'>
          <div className='content-body'>
            {data !== null ? (
              <div className='blog-list-wrapper'>
                <Row>{renderRenderList()}</Row>
                <Row>
                  <Col sm='12'>

                    {/* <Pagination className='d-flex justify-content-center mt-2'>
                      <PaginationItem className='prev-item'>
                        <PaginationLink href='#' onClick={e => e.preventDefault()}></PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href='#' onClick={e => e.preventDefault()}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href='#' onClick={e => e.preventDefault()}>
                          2
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href='#' onClick={e => e.preventDefault()}>
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem active>
                        <PaginationLink href='#' onClick={e => e.preventDefault()}>
                          4
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href='#' onClick={e => e.preventDefault()}>
                          5
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href='#' onClick={e => e.preventDefault()}>
                          6
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href='#' onClick={e => e.preventDefault()}>
                          7
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className='next-item'>
                        <PaginationLink href='#' onClick={e => e.preventDefault()}></PaginationLink>
                      </PaginationItem>
                    </Pagination> */}
                    <Pagination className="d-flex justify-content-center mt-2">
                      <PaginationItem
                        className="prev-item"
                        disabled={!prevPage}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <PaginationLink
                          onClick={(e) => e.preventDefault()}
                        ></PaginationLink>
                      </PaginationItem>
                      {[...Array(totalPages).keys()].map((page) => (
                        <PaginationItem
                          key={page}
                          className={page + 1 === currentPage ? "active" : ""}
                          onClick={() => handlePageChange(page + 1)}
                        >
                          <PaginationLink onClick={(e) => e.preventDefault()}>
                            {page + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem
                        className="next-item"
                        disabled={!nextPage}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <PaginationLink
                          onClick={(e) => e.preventDefault()}
                        ></PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </Col>
                </Row>
              </div>
            ) : null}
          </div>
        </div>
        <Sidebar />
      </div>
    </Fragment>
  )
}

export default BlogList
