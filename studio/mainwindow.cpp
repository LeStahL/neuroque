#include "mainwindow.h"
#include "demoapi.h"

static const double TimeNowSliderFactor = 1000.;

MainWindow::MainWindow()
{
    window.setupUi(this);

    setTimeRange(0.0, 1.0);
    setTimeNow(0.5);

    connect(window.timeNowSlider, &QSlider::valueChanged, this, &MainWindow::onChangeTimeNowSlider);
    connect(window.timeNowSpinBox,static_cast<void(QDoubleSpinBox::*)(double)>(&QDoubleSpinBox::valueChanged), this, &MainWindow::onChangeTimeNowSpinBox);
    
    show();
}

void MainWindow::setTimeNow(double timeNow)
{
    if (abs(DemoApi::api.getTimeNow() - timeNow) >= 1 / TimeNowSliderFactor)
    {
        DemoApi::api.setTimeNow(timeNow);
        setControlsTimeNow(timeNow);
        window.renderViewWidget->update();
    }
}

void MainWindow::setTimeRange(double timeStart, double timeEnd)
{
    if (
            abs(DemoApi::api.getTimeStart() - timeStart) >= 1 / TimeNowSliderFactor
            || abs(DemoApi::api.getTimeEnd() - timeEnd) >= 1 / TimeNowSliderFactor
       )
    {
        DemoApi::api.setTimeStart(timeStart);
        DemoApi::api.setTimeEnd(timeEnd);
        setControlsTimeRange(timeStart, timeEnd);
    }
}

void MainWindow::onChangeTimeNowSlider(int timeNowInt)
{
    double timeNow = static_cast<double>(timeNowInt) / TimeNowSliderFactor;
    setTimeNow(timeNow);
}

void MainWindow::onChangeTimeNowSpinBox(double timeNow)
{
    setTimeNow(timeNow);
}

void MainWindow::setControlsTimeNow(double timeNow)
{
    window.timeNowSpinBox->setValue(timeNow);
    window.timeNowSlider->setValue(static_cast<int>(timeNow * TimeNowSliderFactor));
}

void MainWindow::setControlsTimeRange(double timeStart, double timeEnd)
{
    window.timeNowSpinBox->setRange(timeStart, timeEnd);
    window.timeNowSlider->setRange(static_cast<int>(timeStart * TimeNowSliderFactor), static_cast<int>(timeEnd * TimeNowSliderFactor));
}

