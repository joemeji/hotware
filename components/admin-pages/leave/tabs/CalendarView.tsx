import React, { useEffect, useState } from "react";
import { fetchApi } from "@/utils/api.config";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Combobox from "@/components/ui/combobox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ViewListModal } from "../modals/ViewListModal";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const YEARS = Array.from({ length: 100 }, (_, index) => 2000 + index);
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function generateColor(stringInput: any) {
  let stringUniqueHash = [...stringInput].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return `hsl(${stringUniqueHash % 360}, 50%, 55%)`;
}

function createCalendar(_date: Dayjs): { days: any[]; date: string } {
  const endDay = parseInt(_date.endOf("month").format("D"));
  const calendarDays: any[] = [];

  for (let i = 1; i <= endDay; i++) {
    const currentMonth = _date.format("MM");
    const currentYear = _date.format("YYYY");
    const currDate = dayjs(`${currentMonth}-${i}-${currentYear}`);
    calendarDays.push({
      day: i,
      date: currDate.format("YYYY-MM-DD"),
      weekDay: currDate.format("ddd"),
    });
  }

  const startWeekIndex = WEEKDAYS.findIndex((item) => {
    return calendarDays[0].weekDay === item;
  });
  const endWeekIndex = WEEKDAYS.findIndex((item) => {
    return calendarDays[calendarDays.length - 1].weekDay === item;
  });

  const startWeekEmptyValue = WEEKDAYS.slice(0, startWeekIndex).map(() => null);
  const endWeekEmptyValue = WEEKDAYS.slice(endWeekIndex + 1).map(() => null);
  calendarDays.unshift(...startWeekEmptyValue);
  calendarDays.push(...endWeekEmptyValue);

  return {
    days: calendarDays,
    date: _date.format("YYYY-MM-DD"),
  };
}

const Header = ({
  date: _date,
  setDate,
}: {
  date: string;
  setDate: (date: Dayjs) => void;
}) => {
  const date = dayjs(_date);
  const [year, setYear] = useState<number | null>(+date.format("YYYY"));

  const handlePrevious = () => {
    setDate(date.subtract(1, "month"));
  };

  const handleNext = () => {
    setDate(date.add(1, "month"));
  };

  useEffect(() => {
    if (date) setYear(+date.format("YYYY"));
  }, [date]);

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="text-xl">{date.format("MMMM")}</div>
        <div>
          <Combobox
            contents={YEARS.reverse().map((year) => ({
              value: year,
              text: year,
            }))}
            value={year}
            onChangeValue={(value) => {
              setYear(value);
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="p-2 bg-[#f1f2f7] rounded-md"
          title="Previous"
          onClick={handlePrevious}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="p-2 bg-[#f1f2f7] rounded-md"
          title="Next"
          onClick={handleNext}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

const DayView = ({
  item,
  leaves,
  handleSelect,
}: {
  item: any;
  leaves: any[];
  handleSelect: (selected: string) => void;
}) => {
  const thisDate = dayjs(item.date);
  const list = leaves?.filter(
    (leave) =>
      thisDate.isSameOrAfter(dayjs(leave.excuse_from_date)) &&
      thisDate.isSameOrBefore(dayjs(leave.excuse_to_date))
  );

  return (
    <button
      role="button"
      className="relative m-1 border border-[#edf1f5] py-2.5 h-[130px] hover:bg-[#edf1f5] flex items-end"
      data-date={item.date}
      data-week-day={item.weekDay}
      onClick={() => handleSelect(item.date)}
    >
      <div className="absolute top-2 left-2 text-xl text-[#74838b] font-medium">
        {item.day}
      </div>
      <div className="flex items-center flex-wrap">
        {list?.map((leave, i) => (
          <div
            key={i}
            className={`ml-[${
              i * -1 * 10
            }px] h-12 w-12 p-2 rounded-full text-base flex items-center justify-center text-white font-medium border-2 border-white`}
            style={{
              marginLeft: i * -1 * 8,
              backgroundColor: generateColor(leave.user_firstname),
            }}
          >
            {leave.user_firstname?.[0]}
            {leave.user_lastname?.[0]}
          </div>
        ))}
      </div>
    </button>
  );
};

export const CalendarView = ({ date: _date }: { date?: string | null }) => {
  const { data: session }: any = useSession();
  const [date, setDate] = useState<Dayjs | null>();
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [list, setList] = useState([]);
  const calendar = date ? createCalendar(date) : null;
  const { data } = useSWR(
    session?.user?.access_token && searchQuery
      ? ["/api/leaves?" + searchQuery, session?.user?.access_token]
      : null,
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  const leaves = data?.leaves;

  const handleSelect = (selected: string) => {
    const thisDate = dayjs(selected);
    const list = leaves?.filter(
      (leave: any) =>
        thisDate.isSameOrAfter(dayjs(leave.excuse_from_date)) &&
        thisDate.isSameOrBefore(dayjs(leave.excuse_to_date))
    );

    setList(list);
    setOpenModal(true);
  };

  useEffect(() => {
    if (date) {
      setSearchQuery(
        new URLSearchParams({
          excuse_from_filter: date.startOf("month").format("YYYY-MM-DD"),
          excuse_to_filter: date.endOf("month").format("YYYY-MM-DD"),
          excuse_arrange_by: "excuse_date",
          excuse_sort_by: "ASC",
          all: "true",
        }).toString()
      );
    }
  }, [date]);

  useEffect(() => {
    const d = _date ? dayjs(_date) : dayjs();
    setDate(d);
  }, [_date]);

  if (!calendar) return null;

  return (
    <div className="px-7 py-3 ">
      <ViewListModal
        open={openModal}
        leaves={list}
        onOpenChange={(val) => setOpenModal(val)}
      />
      <Header date={calendar.date} setDate={setDate} />
      <div className="mt-4 grid grid-cols-7">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="bg-[#18181b] text-white text-center py-3 font-semibold"
          >
            {weekday}
          </div>
        ))}
        {calendar.days.map((item, i) =>
          item ? (
            <DayView
              leaves={leaves}
              key={i}
              item={item}
              handleSelect={handleSelect}
            />
          ) : (
            <div key={i}></div>
          )
        )}
      </div>
    </div>
  );
};
