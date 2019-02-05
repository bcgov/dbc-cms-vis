   var alldat, tab;

   function totalFormatter(data) {
       // console.log(data)

       var total = 0;

       if (data.length > 0) {

           var field = this.field;

           total = data.reduce(function(sum, row) {
               return sum + (+row[field]);
           }, 0);

           return total;
       }

       return '';
   };

   function headerFormatter(data) {
       return 'Total'
   }

   function maketable(migration) {
       // console.log(migration)




       var smallDat = []

       // var data = {
       //     resource_id: 'be20dda7-e895-490e-acd2-3cde6dfb382e', // the resource id
       //     limit: 2000
       // };

       // newdat = []
       // url = 'https://catalogue.data.gov.bc.ca/api/action/datastore_search';
       // $.ajax({
       //     async: false,
       //     url: url,
       //     data: data,
       //     success: function(data) {
       alldat = migration;
       // console.log(alldat)
       $.each(alldat, function(key, value) {
           if (value['Province'] != 'B.C.') {
               smallDat.push({
                   DataYear: value['Year'],
                   DataQ: value['Quarter'],
                   RegionName: value['Province'],
                   Destination: value['Destination'],
                   Origin: value['Origin'],
                   Net: value['net']
                   // url1: value['URL1'],
                   // url2: value['URL2']
               })
           }
           //     if (value == 'name'){
           //     console.log(value['sector'])
           // }
       })
       // if (target) spinner.stop();
       //     }
       // });

       $(function() {
           // console.log(smallDat)
           $('#orders-table').bootstrapTable({
               'data': smallDat
           });
       });
   }