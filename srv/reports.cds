service UserReports {
  
  @requires: 'admin'
  @Core.MediaType: 'application/pdf'
  action generateUserStatsPDF(
    stats: {
      totalUsers: Integer;
      activeUsers: Integer;
      totalOrders: Integer;
      avgOrderValue: Decimal(10,2);
      totalLifetimeValue: Decimal(15,2);
      avgOrdersPerUser: Decimal(5,2);
      avgLifetimeValue: Decimal(10,2);
      newUsers2024: Integer;
      topCustomers: array of {
        userId: Integer;
        lifetimeValue: Decimal(10,2);
      };
    }
  ) returns LargeBinary;
  
 @requires: 'admin'
  @Core.MediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  action generateUserStatsXLSX(
    stats: {
      totalUsers: Integer;
      activeUsers: Integer;
      totalOrders: Integer;
      avgOrderValue: Decimal(10,2);
      totalLifetimeValue: Decimal(15,2);
      avgOrdersPerUser: Decimal(5,2);
      avgLifetimeValue: Decimal(10,2);
      newUsers2024: Integer;
      topCustomers: array of {
        userId: Integer;
        lifetimeValue: Decimal(10,2);
      };
    }
  ) returns LargeBinary;

}