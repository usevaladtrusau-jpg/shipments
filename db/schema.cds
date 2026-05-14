using {
  managed,
} from '@sap/cds/common';

namespace sap.capire.orders;


entity Orders : managed {
      @cds.autoinc
      key ID       : Integer ;

      cuid   : String(8) @assert.format : '^[A-Za-z]{3}\d{3}-\d$' ;

      description : String(50) ;

      status   : String 
                        default 'initialized'
                        @assert.range: [
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
      ] ;

      stage    : Int16  default 1;
}
