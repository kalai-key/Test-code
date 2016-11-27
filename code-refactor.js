 $scope.checkAllFieldsPresent = function () {
      if ($scope.requestedListingData) {
        var atleastOneBookableSelected = false;
        var nowTemp = new Date();
        var currentDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
        var isTodayCheckIn = moment($scope.requestedListingData.date_from, 'DD/MM/YYYY').valueOf() == currentDate.getTime();
        var checkInDate = moment($scope.requestedListingData.date_from, 'DD/MM/YYYY').toDate();
        var isPastCheckInDate = checkInDate < currentDate;

        angular.forEach($scope.requestedListingData.bookables, function (value, key) {
          if (value && value.requested > 0) {
            atleastOneBookableSelected = true;
          }
        });
        // Refactor code
        if ($scope.requestedListingData.date_from) {
          if (isPastCheckInDate) {
            if ($scope.packeageType != 1) {
              if ($scope.listing.code === 'startuptour' && $scope.listing.config['default_date']) {
                angular.forEach($scope.requestedListingData.bookables, function (bookable) {
                  bookable.requested = 1;
                });
                return true;
              }
            }
            $scope.showMessage('Please check-in date cannot be in past');
            return false;
          } else {
            if ($scope.packeageType === 1) {
              if ($scope.requestedListingData.date_until)
                $scope.showMessage('Please select your check-in and check-out dates');
            }
          }
        } else {
          $scope.showMessage('Please select your check-in and check-out dates');
        }
        // End Refactor code
        if (!atleastOneBookableSelected) {
          $scope.showMessage('Please select atleast one stay/experience');
          return false;
        } else if (isTodayCheckIn && nowTemp.getHours() >= 24 - $scope.configs.min_hours_for_booking) {
          $scope.showMessage('Booking is closed for today. Please try for next day.');
          return false;
        } else {
          return true;
        }
      } else {
        $scope.showMessage("Internal error, please refresh the page and continue");
        return false;
      }
    }