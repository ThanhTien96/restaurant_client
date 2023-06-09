import React, { useState, useEffect } from "react";
import { Button, DatePicker, Form, Radio, Select } from "antd";
import { Typography } from "antd";
import { useAppSelector } from "../../../store";
const { Title } = Typography;
type SizeType = Parameters<typeof Form>[0]["size"];
import type { SelectProps, DatePickerProps } from "antd";
import { WorkShiftType } from "../../../types/orderType";
import staffRequester from "../../../services/requester/staffRequester";
import moment, { Moment } from "moment";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { CalendarWorkListType } from "../../../types/orderType";

const UpdateCalenderWork: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [calendarDetail, setCalendarDetail] = useState<CalendarWorkListType>();
  const [addStaff, setAddStaff] = useState<
    { is_work: boolean; staff_id: string }[]
  >([]);
  const [dateWork, setDateWork] = useState<string | null>(null);
  const [workShitftId, setWorkShitftId] = useState<string | null>(null);
  const [workShift, setWorkShift] = useState<WorkShiftType[]>([]);
  const navigate = useNavigate();
  const params = useParams();

  console.log(Date.now);

  const getWorkShift = async () => {
    try {
      const res = await staffRequester.getAllWorkShift();
      setWorkShift(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCalendarDetail = async () => {
    try {
      const id = String(params.id);
      const res = await staffRequester.getDetailCalendar(id);
      setCalendarDetail(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWorkShift();
    getCalendarDetail();
    if (calendarDetail) {
      setWorkShitftId(calendarDetail.work_shift_id);
      setDateWork(calendarDetail.date_work); // Đặt giá trị mặc định cho dateWork
    }
  }, []);
  console.log(workShift);

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const handleFinish = async () => {
    try {
      const data = {
        date_work: dateWork,
        work_shift_id: workShitftId,
      };

      await staffRequester.createCalendar(data);
      Swal.fire({
        position: "center",
        icon: "success",
        text: "create calendar work success !",
        showConfirmButton: false,
        timer: 1000,
      });
      navigate("/admin/calendarWork");
    } catch (err) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "create calendar work fail !",
        showConfirmButton: false,
        timer: 1000,
      });
      console.log(err);
    }
  };

  const handleSlectWorkShift = (value: string) => setWorkShitftId(value);

  const handleDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    if (date) {
      const formattedDate = date.format("MM/DD/YYYY");
      setDateWork(formattedDate);
    }
  };

  const workShiftValue = workShift.filter(
    (ele) => ele.id === calendarDetail?.work_shift_id
  );



  return (
    <div>
      <Title className="text-2xl mb-5">Create Calendar Work</Title>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{ size: componentSize }}
        onFinish={() => handleFinish()}
        onValuesChange={onFormLayoutChange}
        size={componentSize as SizeType}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Form Size" name="size">
          <Radio.Group>
            <Radio.Button value="small">Small</Radio.Button>
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="large">Large</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="work shift">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            onChange={handleSlectWorkShift}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            value={String(workShiftValue[0]?.shift_name)}
            options={workShift.map((ele: WorkShiftType) => ({
              label: ele.shift_name,
              value: ele.id,
            }))}
          />
        </Form.Item>

        <Form.Item label="Date Work">
          <DatePicker
            value={dateWork && moment(new Date(dateWork), "MM/DD/YYYY")}
            format={"MM/DD/YYYY"}
            onChange={handleDateChange}
          />
        </Form.Item>
        <Form.Item label="Button">
          <Button htmlType="submit">Button</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateCalenderWork;
