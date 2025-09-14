import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, MapPin, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react";
import { geminiService } from '@/services/geminiService';

const AIInsights = ({ samples }) => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (samples && samples.length > 0) {
      generateInsights();
    }
  }, [samples]);

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await geminiService.generateDataInsights(samples);
      setInsights(result);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel.toLowerCase().includes('high')) return 'text-red-600';
    if (riskLevel.toLowerCase().includes('moderate')) return 'text-amber-600';
    return 'text-green-600';
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Generating AI insights...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={generateInsights} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Upload data to get AI-powered insights</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <span className="text-slate-900">AI Insights</span>
            <p className="text-sm text-slate-600 font-normal">Powered by Google Gemini</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Assessment */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <h4 className="font-semibold text-purple-900">Overall Risk Assessment</h4>
          </div>
          <p className={`text-sm ${getRiskColor(insights.risk_assessment)}`}>
            {insights.risk_assessment}
          </p>
        </div>

        {/* Key Findings */}
        {insights.key_findings?.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Key Findings
            </h4>
            <ul className="space-y-2">
              {insights.key_findings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Priority Metals */}
        {insights.priority_metals?.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Priority Metals
            </h4>
            <div className="flex flex-wrap gap-2">
              {insights.priority_metals.map((metal, index) => (
                <Badge key={index} className="bg-red-100 text-red-800 border-red-200">
                  {metal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Geographic Patterns */}
        {insights.geographic_patterns && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              Geographic Patterns
            </h4>
            <p className="text-sm text-slate-700 bg-green-50 p-3 rounded-lg border border-green-200">
              {insights.geographic_patterns}
            </p>
          </div>
        )}

        {/* Policy Recommendations */}
        {insights.policy_recommendations?.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Policy Recommendations</h4>
            <ul className="space-y-2">
              {insights.policy_recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Health Implications */}
        {insights.health_implications && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2">Health Implications</h4>
            <p className="text-sm text-amber-800">{insights.health_implications}</p>
          </div>
        )}

        <Button 
          onClick={generateInsights} 
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Insights
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIInsights;