using {sap.capire.orders as my} from '../db/schema';

service AdminService {
  entity Orders as projection on my.Orders;
  action updateOrder (

    @mandatory
    @assert.format : '^[A-Za-z]{3}\d{3}-\d$'
    cuid: String  , 
    data: {
    description: String;
    status: String  @assert.range: [
                                        'initialized',
                                        'taken in work',
                                        'prepared for shipment',
                                        'submerged',
                                        'left warehouse',
                                        'border crossing point',
                                        'border crossing point 1',
                                        'border crossing point 2',
                                        'border crossing point 3',
                                        'border crossing point 4',
                                        'border crossing point 5',
                                        'border crossing point 6',
                                        'arrived at the assignment warehouse',
                                        'arrived at the assignment warehouse 1',
                                        'arrived at the assignment warehouse 2',
                                        'arrived at the assignment warehouse 3',
                                        'taken by courier',
                                        'delivered to a customer',
      ];
    stage: Int16;
  }) returns {
    message: String;
    cuid: String;
  };

  action removeOrder (
    @mandatory
    @assert.format : '^[A-Za-z]{3}\d{3}-\d$'
    cuid: String) returns {
    message: String;
    cuid: String;
  };
}
