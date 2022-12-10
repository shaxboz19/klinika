export default {
    methods: {
        parseDate(date, time) {
            const [day, month, year] = date.split("-");
            const [hours, minutes] = time.split(":");
            const ts = new Date(+year, +month - 1, +day, hours, minutes).getTime();
            return ts;
          },   
          splitInterval(start, end, step) {
            let result = [];
      
            for (let ts = start; ts < end; ts += step) {
              const hour = new Date(ts).getHours();
              const min = new Date(ts).getMinutes();
              if (min == 0) {
                min = "00";
              }
      
              result.push({ time: `${hour}:${min}`, isActive: false });
            } 
            return result;
          },
    },
}