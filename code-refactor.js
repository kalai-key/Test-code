 $scope.checkAllFieldsPresent = function () {
      if (!$scope.requestedListingData) {
        $scope.showMessage("Internal error, please refresh the page and continue");
        return false;
      }

      var atleastOneBookableSelected = false;
      var nowTemp = new Date();
      var currentDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
      var isTodayCheckIn = moment($scope.requestedListingData.date_from, 'DD/MM/YYYY').valueOf() == currentDate.getTime();
      var checkInDate = moment($scope.requestedListingData.date_from, 'DD/MM/YYYY').toDate();
      var isPastCheckInDate = checkInDate < currentDate;

      var date_from = $scope.requestedListingData.date_from;
      var date_until = $scope.requestedListingData.date_until;
      var message;

      // hack to get statup tour request video working
      if ($scope.packeageType !== 1 &&
          $scope.listing.code === 'startuptour' &&
          $scope.listing.config.default_date) {
            angular.forEach(bookables, (bookable) => {
              bookable.requested = 1;
          });
          return true;
      }

      if (isPastCheckInDate) {
          message = 'Please check-in date cannot be in past';
      }

      if ($scope.packeageType === 1 && (!date_from || !date_until)) {
          message = message || 'Please select your check-in and check-out dates';
      }

      if ($scope.requestedListingData.bookables.some(b => b && b.requested > 0)) {
        message = message || 'Please select atleast one stay/experience';
      }

      if (isTodayCheckIn && nowTemp.getHours() >= 24 - $scope.configs.min_hours_for_booking) {
          message = message || 'Booking is closed for today. Please try for next day.';
      }

      if (message) {
          $scope.showMessage(message);
          return false;
      }
      return true;
    }