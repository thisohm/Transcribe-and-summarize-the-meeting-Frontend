import { Button,Result } from "antd"

const ResultPage = () => {

  return (
    <>
        <Result
            status="success"
            title="Create Meeting Success"
            extra={[
            <Button type="primary" key="console" href="/">
                Go Meetings
            </Button>,
            <Button key="buy" href="/import">Create Meetings</Button>,
        ]}
        />
    </>
  )
}

export default ResultPage